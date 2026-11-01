import type {Plugin} from 'obsidian';
import type {DoubanPluginSetting} from '../settings/model/DoubanPluginSetting';
import {sanitizeImportedSettings} from '../settings/SettingsIO';

/** The persistence boundary shared by startup and settings-file import. */
export default class SettingsStore {
	constructor(private readonly persistence: Pick<Plugin, 'loadData' | 'saveData'>) {}

	static decode(payload: unknown): DoubanPluginSetting {
		// Pass the raw payload through. Applying defaults first would hide whether
		// a template config was absent and prevent legacy file-path migration.
		return sanitizeImportedSettings(payload);
	}

	async load(): Promise<DoubanPluginSetting> {
		return SettingsStore.decode(await this.persistence.loadData());
	}

	async save(settings: DoubanPluginSetting): Promise<void> {
		await this.persistence.saveData(settings);
	}
}
