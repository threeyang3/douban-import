import type {Command, Editor} from 'obsidian';
import type DoubanImportPlugin from '../main';
import type HandleContext from '../sources/douban/models/HandleContext';
import {Action, SearchHandleMode, SupportType} from '../shared/constants';
import {i18nHelper} from '../i18n/helper';
import DoubanBatchImportModal from '../ui/modals/DoubanBatchImportModal';
import {UserDataExportModal, UserDataImportModal} from '../userdata/UserDataModal';

type ContextOptions = Partial<Pick<HandleContext,
	'mode' | 'action' | 'editor' | 'showAfterCreate' | 'syncStatusHolder'>>;

/** Resolve dependencies when a command runs, including settings replaced by import. */
export function createCommandContext(plugin: DoubanImportPlugin, options: ContextOptions = {}): HandleContext {
	return {
		plugin,
		mode: SearchHandleMode.FOR_CREATE,
		action: Action.SearchAndCrate,
		settings: plugin.settings,
		userComponent: plugin.userComponent,
		netFileHandler: plugin.netFileHandler,
		showAfterCreate: plugin.settings.showAfterCreate,
		...options,
	};
}

export function createSyncContext(plugin: DoubanImportPlugin): HandleContext {
	return createCommandContext(plugin, {
		action: Action.Sync,
		showAfterCreate: undefined,
		syncStatusHolder: plugin.statusHolder,
	});
}

interface CommandDefinition {
	id: string;
	label: string;
	editor?: boolean;
	run: (plugin: DoubanImportPlugin, editor?: Editor) => unknown;
}

function searchCommand(id: string, label: string, type?: SupportType): CommandDefinition {
	return {
		id, label,
		run: plugin => plugin.getDoubanTextForCreateNewNoteForType(
			createCommandContext(plugin), type ?? plugin.settings.searchDefaultType,
		),
	};
}

// Local IDs stay stable for command integrations. Obsidian supplies our plugin-ID prefix.
const DEFINITIONS: readonly CommandDefinition[] = [
	searchCommand('searcher-douban-import-and-create-file', '110101'),
	{
		id: 'douban-batch-import-urls', label: 'batchImportCommand',
		run: plugin => new DoubanBatchImportModal(
			plugin.app, plugin, createCommandContext(plugin, {showAfterCreate: false}),
		).open(),
	},
	{
		id: 'searcher-douban-and-input-current-file', label: '110002', editor: true,
		run: (plugin, editor) => plugin.getDoubanTextForSearchTerm(createCommandContext(plugin, {
			mode: SearchHandleMode.FOR_REPLACE, action: Action.SearchAndReplace, editor,
			showAfterCreate: undefined,
		})),
	},
	{
		id: 'searcher-douban-by-current-file-name', label: '110001', editor: true,
		run: (plugin, editor) => plugin.getDoubanTextForActiveFile(createCommandContext(plugin, {
			mode: SearchHandleMode.FOR_REPLACE, action: Action.SearchEditorAndReplace, editor,
			showAfterCreate: undefined,
		})),
	},
	{
		id: 'sync-douban-import-and-create-file', label: '110103',
		run: plugin => plugin.showSyncModal(createSyncContext(plugin)),
	},
	searchCommand('searcher-douban-import-and-create-file-movie-tv', '110102', SupportType.movie),
	searchCommand('searcher-douban-import-and-create-file-book', '110104', SupportType.book),
	searchCommand('searcher-douban-import-and-create-file-music', '110105', SupportType.music),
	searchCommand('searcher-douban-import-and-create-file-game', '110106', SupportType.game),
	{
		id: 'douban-create-or-append-note', label: '110107',
		run: plugin => plugin.doubanNoteManager.createOrAppendForCurrentFile(),
	},
	{
		id: 'douban-link-existing-note', label: '110108',
		run: plugin => plugin.doubanNoteManager.linkExistingNoteForCurrentFile(),
	},
	{
		id: 'douban-export-user-data', label: '110109',
		run: plugin => new UserDataExportModal(plugin).open(),
	},
	{
		id: 'douban-import-user-data', label: '110110',
		run: plugin => new UserDataImportModal(plugin).open(),
	},
];

export function registerCommands(plugin: DoubanImportPlugin): void {
	for (const definition of DEFINITIONS) {
		const command: Command = {id: definition.id, name: i18nHelper.getMessage(definition.label)};
		if (definition.editor === true) {
			command.editorCallback = editor => definition.run(plugin, editor);
		} else {
			command.callback = () => definition.run(plugin);
		}
		plugin.addCommand(command);
	}
}
