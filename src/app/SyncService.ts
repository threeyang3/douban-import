// SPDX-License-Identifier: GPL-3.0-only
// Sync and authentication workflows inherited from threeyang3/douban-sync,
// reorganized into an application service for Douban Import.

import {Notice} from 'obsidian';
import type DoubanImportPlugin from '../main';
import type HandleContext from '../sources/douban/models/HandleContext';
import type {SyncConfig} from '../sync/model/SyncConfig';
import type {SyncOutcome} from '../sync/model/SyncStatusHolder';
import SyncHandler from '../sync/handler/SyncHandler';
import {DEFAULT_SETTINGS} from '../settings/defaults';
import {SyncTypeRecords} from '../shared/constants';
import {i18nHelper} from '../i18n/helper';
import {log} from '../shared/Logutil';

/** Runs an explicitly requested sync; construction performs no network access. */
export default class SyncService {
	constructor(private readonly plugin: DoubanImportPlugin) {}

	async sync(context: HandleContext): Promise<void> {
		try {
			// The facade is intentionally retained for UI and test integrations.
			if (!await this.plugin.checkLogin(context)) return;

			const config = context.syncConfig;
			new Notice(i18nHelper.getMessage('140301', SyncTypeRecords[config.syncType]));
			this.applySyncDefaults(config);
			await context.syncStatusHolder.initHandledData();
			this.plugin.showStatus(i18nHelper.getMessage('140203', SyncTypeRecords[config.syncType]));

			const handler = new SyncHandler(this.plugin.app, this.plugin, config, context);
			const outcome = await handler.sync();
			this.showOutcome(outcome, context.syncStatusHolder.syncStatus.reportErrors);
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			log.error(i18nHelper.getMessage('140206', detail), error);
		} finally {
			try {
				await context.plugin.statusHolder.completeSync();
			} finally {
				// Saving the handled-data cache can fail; always release the UI state.
				context.syncActive = false;
				this.plugin.clearStatusBarDelay();
			}
		}
	}

	async checkLogin(context: HandleContext): Promise<boolean> {
		this.plugin.settingsManager.debug('主界面:同步时的登录状态检测');
		const user = context.userComponent;
		// Saved credentials are verified only when the user starts a sync.
		if (user.isLogin() && !user.isVerified()) await user.login();
		if (user.needLogin()) await user.login();
		if (user.isLogin()) return true;

		this.plugin.settingsManager.debug('主界面:同步时的登录状态检测完成: 尝试获取用户信息失败');
		new Notice(i18nHelper.getMessage('140303'));
		return false;
	}

	private applySyncDefaults(config: SyncConfig): void {
		config.dataFilePath = config.dataFilePath || DEFAULT_SETTINGS.dataFilePath;
		config.templateFile = config.templateFile || '';
		config.attachmentPath = config.attachmentPath || DEFAULT_SETTINGS.attachmentPath;
		config.dataFileNamePath = config.dataFileNamePath || DEFAULT_SETTINGS.dataFileNamePath;
		config.inheritOldFields = !!config.inheritOldFields;
	}

	private showOutcome(outcome: SyncOutcome, reportErrors: string[]): void {
		const warning = reportErrors.length
			? '\n' + i18nHelper.getMessage('sync_report_failed', reportErrors.join('; ')) : '';
		new Notice(i18nHelper.getMessage(`sync_outcome_${outcome}`) + warning);
	}
}
