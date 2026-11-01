import {Plugin} from 'obsidian';
import type {Editor} from 'obsidian';
import type {DoubanPluginSetting} from './settings/model/DoubanPluginSetting';
import type {DoubanPluginOnlineData} from './settings/model/DoubanPluginOnlineData';
import type DoubanSubject from './sources/douban/models/DoubanSubject';
import type HandleContext from './sources/douban/models/HandleContext';
import type HandleResult from './sources/douban/models/HandleResult';
import {BasicConst, SupportType} from './shared/constants';
import {DoubanSearchChooseItemHandler} from './sources/douban/loaders/DoubanSearchChooseItemHandler';
import {DoubanSettingTab} from './settings/DoubanSettingTab';
import {DoubanSyncModal} from './ui/modals/DoubanSyncModal';
import FileHandler from './platform/vault/FileHandler';
import GlobalStatusHolder from './sync/GlobalStatusHolder';
import NetFileHandler from './platform/network/NetFileHandler';
import SettingsManager from './settings/SettingsManager';
import UserComponent from './sources/douban/auth/UserComponent';
import {DoubanNoteManager} from './notes/DoubanNoteManager';
import {i18nHelper} from './i18n/helper';
import ImportService from './app/ImportService';
import SearchService from './app/SearchService';
import SyncService from './app/SyncService';
import SettingsStore from './app/SettingsStore';
import StatusBarController from './app/StatusBarController';
import {createSyncContext, registerCommands} from './app/commands';

/** Application composition root and compatibility facade for existing feature modules. */
export default class DoubanImportPlugin extends Plugin {
	public settings: DoubanPluginSetting;
	public doubanExtractHandler: DoubanSearchChooseItemHandler;
	public doubanStatusBar: HTMLElement;
	public fileHandler: FileHandler;
	public userComponent: UserComponent;
	public settingsManager: SettingsManager;
	public netFileHandler: NetFileHandler;
	public statusHolder: GlobalStatusHolder;
	public onlineData: DoubanPluginOnlineData;
	public settingTab: DoubanSettingTab;
	public doubanNoteManager: DoubanNoteManager;

	private importService?: ImportService;
	private searchService?: SearchService;
	private syncService?: SyncService;
	private settingsStore?: SettingsStore;
	private statusController?: StatusBarController;

	// Services keep a live host reference and can also support isolated feature calls.
	private get imports(): ImportService {
		return this.importService ??= new ImportService(this);
	}

	private get searches(): SearchService {
		return this.searchService ??= new SearchService(this);
	}

	private get synchronization(): SyncService {
		return this.syncService ??= new SyncService(this);
	}

	private get store(): SettingsStore {
		return this.settingsStore ??= new SettingsStore(this);
	}

	private get status(): StatusBarController {
		return this.statusController ??= new StatusBarController(
			() => this.doubanStatusBar,
			() => this.settings?.statusBar ?? false,
			BasicConst.CLEAN_STATUS_BAR_DELAY,
		);
	}

	async onload(): Promise<void> {
		await this.loadSettings();
		this.fileHandler = new FileHandler(this.app);
		this.doubanExtractHandler = new DoubanSearchChooseItemHandler(this.app, this);
		this.settingsManager = new SettingsManager(this.app, this);
		this.userComponent = new UserComponent(this.settingsManager);
		this.netFileHandler = new NetFileHandler(this.fileHandler);
		this.statusHolder = new GlobalStatusHolder(this.app, this);
		this.doubanNoteManager = new DoubanNoteManager(this.app, this);
		this.userComponent.assumeLoggedIn();

		if (this.settings.statusBar) this.doubanStatusBar = this.addStatusBarItem();
		this.settingTab = new DoubanSettingTab(this.app, this);
		this.addSettingTab(this.settingTab);
		registerCommands(this);
		this.addRibbonIcon('book-open', i18nHelper.getMessage('110103'), () => {
			void this.showSyncModal(createSyncContext(this));
		});
	}

	async onunload(): Promise<void> {
		this.status.dispose();
		this.statusHolder?.stopSync();
		await this.statusHolder?.onunload();
	}

	async loadSettings(): Promise<void> {
		this.settings = await this.store.load();
		if (this.settingsManager) this.settingsManager.settings = this.settings;
	}

	async saveSettings(): Promise<void> {
		await this.store.save(this.settings);
	}

	showStatus(text: string): void {
		this.status.show(text);
	}

	clearStatusBarDelay(): void {
		this.status.clearLater();
	}

	putToObsidian(context: HandleContext, subject: DoubanSubject): Promise<boolean> {
		return this.imports.putToObsidian(context, subject);
	}

	putContentToObsidian(context: HandleContext, result: HandleResult): Promise<boolean> {
		return this.imports.putContentToObsidian(context, result);
	}

	putToEditor(editor: Editor, content: string): Promise<void> {
		return this.imports.putToEditor(editor, content);
	}

	createFile(context: HandleContext, result: HandleResult): Promise<boolean> {
		return this.imports.createFile(context, result);
	}

	search(term: string, type: SupportType, context: HandleContext): Promise<void> {
		return this.searches.search(term, type, context);
	}

	getDoubanTextForActiveFile(context: HandleContext): Promise<void> {
		return this.searches.searchActiveFile(context);
	}

	async getDoubanTextForCreateNewNote(context: HandleContext): Promise<void> {
		this.searches.open(context);
	}

	async getDoubanTextForCreateNewNoteForType(context: HandleContext, type: SupportType): Promise<void> {
		this.searches.open(context, type);
	}

	async getDoubanTextForSearchTerm(context: HandleContext): Promise<void> {
		this.searches.open(context);
	}

	async showSyncModal(context: HandleContext): Promise<void> {
		new DoubanSyncModal(this.app, this, context).open();
	}

	sync(context: HandleContext): Promise<void> {
		return this.synchronization.sync(context);
	}

	checkLogin(context: HandleContext): Promise<boolean> {
		return this.synchronization.checkLogin(context);
	}
}
