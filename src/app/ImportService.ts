// SPDX-License-Identifier: GPL-3.0-only
// Import and replacement workflows inherited from threeyang3/douban-sync,
// reorganized into an application service for Douban Import.

import {Editor, TFile} from 'obsidian';
import type DoubanImportPlugin from '../main';
import {Action, SearchHandleMode, SubjectHandledStatus} from '../shared/constants';
import {DEFAULT_SETTINGS} from '../settings/defaults';
import {FileUtil} from '../shared/FileUtil';
import {log} from '../shared/Logutil';
import {i18nHelper} from '../i18n/helper';
import type DoubanSubject from '../sources/douban/models/DoubanSubject';
import type HandleContext from '../sources/douban/models/HandleContext';
import type HandleResult from '../sources/douban/models/HandleResult';
import DoubanPageGuard from '../sources/douban/parsing/DoubanPageGuard';
import type SyncStatusHolder from '../sync/model/SyncStatusHolder';
import {UserDataExtractor} from '../userdata/UserDataExtractor';
import {UserDataMerger} from '../userdata/UserDataMerger';
import type {DoubanUserData} from '../userdata/types';

interface ReplacementPlan {
	originalPath: string | null;
	originalContent: string | null;
	backupPath: string | null;
	content: string;
}

/** Coordinates a parsed subject's template rendering and protected vault writes. */
export default class ImportService {
	constructor(private readonly plugin: DoubanImportPlugin) {}

	async putToObsidian(context: HandleContext, subject: DoubanSubject): Promise<boolean> {
		const status = context.syncStatusHolder?.syncStatus ?? null;
		context.importError = '';
		try {
			if (!subject) {
				context.importError = i18nHelper.getMessage('140101');
				log.warn(context.importError);
				return false;
			}
			DoubanPageGuard.assertValidSubject(subject);
			if (this.rejectTypeMismatch(context, subject, status)) return false;

			this.showProgress(context, subject, status, false);
			const result = await this.plugin.doubanExtractHandler.parseText(subject, context);
			if (!result) {
				context.importError = '模板解析结果为空';
				return false;
			}
			// Keep the plugin facade as the integration seam for source handlers.
			if (!await this.plugin.putContentToObsidian(context, result)) return false;

			subject.handledStatus = SubjectHandledStatus.saved;
			this.showProgress(context, subject, status, true);
			return true;
		} catch (error) {
			const detail = DoubanPageGuard.describeError(error);
			context.importError = detail;
			log.error(i18nHelper.getMessage('140206', detail), error);
			status?.fail(subject?.id || '', subject?.title || '', detail);
			return false;
		} finally {
			this.plugin.clearStatusBarDelay();
		}
	}

	async putContentToObsidian(context: HandleContext, result: HandleResult): Promise<boolean> {
		switch (context.mode) {
			case SearchHandleMode.FOR_CREATE:
				return this.plugin.createFile(context, result);
			case SearchHandleMode.FOR_REPLACE:
				await this.plugin.putToEditor(context.editor, result.content);
				return true;
			default:
				return false;
		}
	}

	async putToEditor(editor: Editor, content: string): Promise<void> {
		editor.replaceSelection(content);
	}

	async createFile(context: HandleContext, result: HandleResult): Promise<boolean> {
		const requestedPath = FileUtil.join(result.filePath || DEFAULT_SETTINGS.dataFilePath, result.fileName);
		if (context.action !== Action.Sync) {
			await this.plugin.fileHandler.createNewNoteWithData(requestedPath, result.content, context.showAfterCreate);
			return true;
		}

		const status = context.syncStatusHolder.syncStatus;
		const filePath = await this.resolveSyncPath(requestedPath, result.subject, status);
		if (status.syncConfig.force) {
			const plan = await this.prepareReplacement(context, result, status);
			return plan ? this.replaceFile(context, result.subject, status, filePath, plan) : false;
		}

		const fullPath = `${filePath}.md`;
		const created = await this.plugin.fileHandler.createNewNoteWithData(
			filePath, result.content, context.showAfterCreate, false,
		);
		if (created) {
			status.create(result.subject.id, result.subject.title, fullPath);
		} else {
			status.exists(result.subject.id, result.subject.title, fullPath);
			context.importError = `文件已存在：${fullPath}`;
		}
		return created;
	}

	private rejectTypeMismatch(context: HandleContext, subject: DoubanSubject, status: SyncStatusHolder | null): boolean {
		if (!context.syncActive || !subject.guessType || subject.guessType === subject.type) return false;

		subject.handledStatus = SubjectHandledStatus.syncTypeDiffAbort;
		context.importError = i18nHelper.getMessage('140102', subject.type, subject.title, subject.guessType);
		if (context.action === Action.Sync) {
			this.showProgress(context, subject, status, false);
			status.failByDiffType(subject.id, subject.title,
				`${i18nHelper.getMessage(subject.guessType)} -> ${subject.type}`);
		} else {
			console.log(context.importError);
		}
		return true;
	}

	private showProgress(context: HandleContext, subject: DoubanSubject, status: SyncStatusHolder | null, saved: boolean): void {
		const message = context.action === Action.Sync
			? i18nHelper.getMessage(saved ? '140208' : '140207', status.getHasHandle(), status.getTotal(), subject.title)
			: i18nHelper.getMessage(saved ? '140205' : '140204', subject.title);
		this.plugin.showStatus(message);
	}

	private async resolveSyncPath(requestedPath: string, subject: DoubanSubject, status: SyncStatusHolder): Promise<string> {
		const {adapter} = this.plugin.app.vault;
		if (!await adapter.exists(`${requestedPath}.md`)
			|| status.getDoubanIdForFilePath(`${requestedPath}.md`) === subject.id) return requestedPath;

		// Titles can coincide across subjects. Never replace another subject's note.
		const basePath = `${requestedPath} (${subject.id})`;
		let filePath = basePath;
		let suffix = 2;
		while (await adapter.exists(`${filePath}.md`)
			&& status.getDoubanIdForFilePath(`${filePath}.md`) !== subject.id) {
			filePath = `${basePath} (${suffix++})`;
		}
		return filePath;
	}

	private async prepareReplacement(context: HandleContext, result: HandleResult, status: SyncStatusHolder): Promise<ReplacementPlan | null> {
		const {subject} = result;
		const plan: ReplacementPlan = {
			originalPath: status.getExistingFilePath(subject.id),
			originalContent: null,
			backupPath: null,
			content: result.content,
		};
		let userData: DoubanUserData | null = null;
		if (plan.originalPath) {
			try {
				if (this.plugin.settings.syncBackupBeforeReplace) {
					plan.backupPath = await this.plugin.fileHandler.backupMarkdownFile(
						plan.originalPath, this.plugin.settings.syncBackupFolder,
					);
				}
			} catch (error) {
				this.recordFailure(context, subject, status, `备份旧文件失败：${plan.originalPath}`, error,
					`Failed to backup file before force sync: ${plan.originalPath}`);
				return null;
			}

			try {
				const file = this.plugin.app.vault.getAbstractFileByPath(plan.originalPath);
				if (!(file instanceof TFile)) throw new Error('Original file unavailable');
				plan.originalContent = await this.plugin.app.vault.read(file);
				userData = await new UserDataExtractor(this.plugin.app).extractFromFileAsync(file);
				if (context.syncConfig?.inheritOldFields && !userData) {
					throw new Error('Unable to extract protected data from original file');
				}
			} catch (error) {
				this.recordFailure(context, subject, status, `读取旧文件数据失败：${plan.originalPath}`, error,
					`Failed to extract local user data from ${plan.originalPath}`);
				return null;
			}
		}

		// Finish inheritance before the first write, including when backups are off.
		try {
			if (userData && context.syncConfig?.inheritOldFields) {
				plan.content = new UserDataMerger().mergeUserData(result.content, userData, this.plugin.settings.dataProtection);
			}
		} catch (error) {
			this.recordFailure(context, subject, status, `继承旧文件数据失败，已停止替换：${subject.title}`, error);
			return null;
		}
		return plan;
	}

	private async replaceFile(context: HandleContext, subject: DoubanSubject, status: SyncStatusHolder, filePath: string, plan: ReplacementPlan): Promise<boolean> {
		const fullPath = `${filePath}.md`;
		let replaced: boolean;
		try {
			replaced = await this.plugin.fileHandler.createOrReplaceNewNoteWithData(filePath, plan.content, context.showAfterCreate);
		} catch (error) {
			try {
				await this.rollbackWrite(fullPath, plan);
			} catch (rollbackError) {
				const detail = `写入失败且回滚失败，请人工检查：${fullPath}`;
				context.importError = detail;
				status.manualReview(subject.id, subject.title, fullPath, detail + (plan.backupPath ? `；备份：${plan.backupPath}` : ''));
				log.error(detail, rollbackError);
				return false;
			}
			return this.recordFailure(context, subject, status, `写入新文件失败：${fullPath}`, error,
				`Failed to write synced file: ${fullPath}`);
		}

		// A renamed note's original is removed only after its replacement was written.
		if (plan.originalPath && plan.originalPath !== fullPath) {
			try {
				await this.plugin.fileHandler.deleteFile(plan.originalPath);
				status.removeFromExistingCache(subject.id);
			} catch (error) {
				context.importError = `旧文件删除失败，已保留新旧两个文件：${plan.originalPath}`;
				status.manualReview(subject.id, subject.title, fullPath, context.importError);
				log.error(`Failed to delete old file after force sync: ${plan.originalPath}`, error);
				return false;
			}
		}

		if (replaced) status.replace(subject.id, subject.title, fullPath);
		else status.create(subject.id, subject.title, fullPath);
		return true;
	}

	private async rollbackWrite(fullPath: string, plan: ReplacementPlan): Promise<void> {
		if (plan.originalContent !== null && plan.originalPath === fullPath) {
			const original = this.plugin.app.vault.getAbstractFileByPath(fullPath);
			if (!(original instanceof TFile)) throw new Error('Original file unavailable for rollback');
			await this.plugin.app.vault.modify(original, plan.originalContent);
		} else if (plan.originalPath && plan.originalPath !== fullPath) {
			await this.plugin.fileHandler.deleteFile(fullPath);
		}
	}

	private recordFailure(context: HandleContext, subject: DoubanSubject, status: SyncStatusHolder, detail: string, error: unknown, logMessage = detail): false {
		context.importError = detail;
		status.fail(subject.id, subject.title, detail);
		log.error(logMessage, error);
		return false;
	}
}
