import type {Command, Editor} from 'obsidian';
import {requestUrl} from 'obsidian';
import DoubanImportPlugin from '../src/main';
import {Action, BasicConst, SearchHandleMode, SupportType} from '../src/shared/constants';
import {DoubanHttpUtil} from '../src/sources/douban/http';
import UserComponent from '../src/sources/douban/auth/UserComponent';

// Exercise the real composition root; only the Obsidian host surface is replaced.
jest.mock('obsidian', () => new Proxy({
	...jest.requireActual('./mocks/obsidian'),
	Plugin: class {
		constructor(public app: unknown, public manifest: unknown) {}
		loadData = jest.fn(async (): Promise<unknown> => null);
		saveData = jest.fn(async (_data: unknown) => {});
		addCommand = jest.fn((command: unknown) => command);
		addSettingTab = jest.fn();
		addRibbonIcon = jest.fn();
		addStatusBarItem = jest.fn(() => ({empty: jest.fn(), setText: jest.fn()}));
	},
	PluginSettingTab: class {
		constructor(public app: unknown, public plugin: unknown) {}
	},
}, {get: (target, key) => key in target ? target[key] : class {}}));

function fixture(payload?: unknown): DoubanImportPlugin {
	const app = {vault: {getMarkdownFiles: jest.fn(() => [])}, workspace: {getActiveFile: jest.fn()}};
	const plugin = new DoubanImportPlugin(app as any, {
		id: 'douban-import', name: 'Douban Import', version: '0.1.0', minAppVersion: '1.0.0',
		author: 'threeyang3', description: 'Import Douban records.',
	});
	(plugin.loadData as jest.Mock).mockResolvedValue(payload);
	return plugin;
}

function commands(plugin: DoubanImportPlugin): Command[] {
	return (plugin.addCommand as jest.Mock).mock.calls.map(call => call[0] as Command);
}

describe('application lifecycle and command wiring', () => {
	afterEach(() => {
		jest.restoreAllMocks();
		jest.clearAllMocks();
		jest.useRealTimers();
	});

	it.each([undefined, {loginCookiesContent: 'dbcl2=saved-session'}])(
		'loads without a request or vault scan, including with saved credentials: %p', async payload => {
			const network = jest.spyOn(DoubanHttpUtil, 'httpRequestGet').mockRejectedValue(new Error('Unexpected startup request'));
			const login = jest.spyOn(UserComponent.prototype, 'login');
			const plugin = fixture(payload);
			const ready: boolean[] = [];
			(plugin.addCommand as jest.Mock).mockImplementation((command: Command) => {
				ready.push(!!(plugin.settingsManager && plugin.userComponent && plugin.netFileHandler
					&& plugin.statusHolder && plugin.doubanNoteManager));
				return command;
			});

			await plugin.onload();

			expect(ready).toHaveLength(13);
			expect(ready.every(Boolean)).toBe(true);
			expect(network).not.toHaveBeenCalled();
			expect(requestUrl).not.toHaveBeenCalled();
			expect(login).not.toHaveBeenCalled();
			expect(plugin.app.vault.getMarkdownFiles).not.toHaveBeenCalled();
			expect(plugin.saveData).not.toHaveBeenCalled();
			expect(plugin.userComponent.isVerified()).toBe(false);
			expect(Boolean(plugin.userComponent.isLogin())).toBe(Boolean(payload));
			await plugin.onunload();
		},
	);

	it('retains all command IDs and resolves imported settings when an existing command runs', async () => {
		const plugin = fixture();
		await plugin.onload();
		const registered = commands(plugin);
		expect(registered.map(command => command.id)).toEqual([
			'searcher-douban-import-and-create-file', 'douban-batch-import-urls',
			'searcher-douban-and-input-current-file', 'searcher-douban-by-current-file-name',
			'sync-douban-import-and-create-file', 'searcher-douban-import-and-create-file-movie-tv',
			'searcher-douban-import-and-create-file-book', 'searcher-douban-import-and-create-file-music',
			'searcher-douban-import-and-create-file-game', 'douban-create-or-append-note',
			'douban-link-existing-note', 'douban-export-user-data', 'douban-import-user-data',
		]);
		const previous = plugin.settings;
		await plugin.settingsManager.loadAndSaveSettings({settings: {
			searchDefaultType: SupportType.book, showAfterCreate: false, dataFilePath: 'Library',
		}});
		expect(plugin.settings).not.toBe(previous);
		expect(plugin.settingsManager.settings).toBe(plugin.settings);
		const openSearch = jest.spyOn(plugin, 'getDoubanTextForCreateNewNoteForType').mockResolvedValue();
		await registered[0].callback();
		expect(openSearch).toHaveBeenCalledWith(expect.objectContaining({
			plugin, settings: plugin.settings, userComponent: plugin.userComponent,
			netFileHandler: plugin.netFileHandler, showAfterCreate: false,
		}), SupportType.book);
		expect(openSearch.mock.calls[0][0].settings).toBe(plugin.settings);
		await plugin.onunload();
	});

	it('passes the live editor to replacement commands and the current sync holder to sync', async () => {
		const plugin = fixture();
		await plugin.onload();
		const registered = commands(plugin);
		const replace = jest.spyOn(plugin, 'getDoubanTextForSearchTerm').mockResolvedValue();
		const sync = jest.spyOn(plugin, 'showSyncModal').mockResolvedValue();
		const editor = {replaceSelection: jest.fn()} as unknown as Editor;
		const command = registered.find(item => item.id === 'searcher-douban-and-input-current-file');
		await command.editorCallback(editor, null);
		expect(replace).toHaveBeenCalledWith(expect.objectContaining({
			editor, mode: SearchHandleMode.FOR_REPLACE, action: Action.SearchAndReplace,
		}));
		await registered.find(item => item.id === 'sync-douban-import-and-create-file').callback();
		expect(sync).toHaveBeenCalledWith(expect.objectContaining({
			settings: plugin.settings, action: Action.Sync, syncStatusHolder: plugin.statusHolder,
		}));
		await plugin.onunload();
	});

	it('keeps SettingsManager aligned when stored settings are reloaded', async () => {
		const plugin = fixture();
		await plugin.onload();
		(plugin.loadData as jest.Mock).mockResolvedValue({bookTemplateFile: 'Templates/books.md'});
		await plugin.loadSettings();
		expect(plugin.settingsManager.settings).toBe(plugin.settings);
		expect(plugin.settingsManager.getSetting('bookTemplateConfig')).toEqual({
			source: 'file', filePath: 'Templates/books.md',
		});
		await plugin.onunload();
	});

	it('cancels stale status cleanup and stops pending lifecycle work on unload', async () => {
		jest.useFakeTimers({doNotFake: ['performance']});
		const plugin = fixture({statusBar: true});
		await plugin.onload();
		const empty = plugin.doubanStatusBar.empty as jest.Mock;
		plugin.showStatus('First import');
		plugin.clearStatusBarDelay();
		jest.advanceTimersByTime(BasicConst.CLEAN_STATUS_BAR_DELAY - 1);
		plugin.showStatus('Next import');
		empty.mockClear();
		jest.advanceTimersByTime(1);
		expect(empty).not.toHaveBeenCalled();
		plugin.clearStatusBarDelay();
		plugin.statusHolder.syncStarted = true;
		await plugin.onunload();
		expect(plugin.statusHolder.syncing()).toBe(false);
		expect(jest.getTimerCount()).toBe(0);
		empty.mockClear();
		plugin.showStatus('A late async result');
		plugin.clearStatusBarDelay();
		jest.runOnlyPendingTimers();
		expect(empty).not.toHaveBeenCalled();
		expect(jest.getTimerCount()).toBe(0);
	});
});
