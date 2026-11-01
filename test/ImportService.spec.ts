import {TFile} from 'obsidian';
import ImportService from '../src/app/ImportService';
import {UserDataExtractor} from '../src/userdata/UserDataExtractor';

jest.mock('obsidian', () => new Proxy(jest.requireActual('./mocks/obsidian'), {
	get: (target, key) => key in target ? target[key] : class {},
}));

describe('import service protected replacements', () => {
	afterEach(() => jest.restoreAllMocks());

	function fixture(originalPath = 'movies/Demo.md') {
		const files = new Map([[originalPath, 'original notes']]);
		const original = Object.assign(new TFile(), {path: originalPath});
		const status = {
			syncConfig: {force: true},
			getDoubanIdForFilePath: (path: string) => path === originalPath ? '222' : null,
			getExistingFilePath: () => originalPath,
			removeFromExistingCache: jest.fn(),
			create: jest.fn(), replace: jest.fn(), fail: jest.fn(), manualReview: jest.fn(),
		};
		const plugin = {
			app: {vault: {
				adapter: {exists: async (path: string) => files.has(path)},
				getAbstractFileByPath: () => original,
				read: jest.fn(async () => files.get(originalPath)),
			}},
			settings: {syncBackupBeforeReplace: true, syncBackupFolder: 'backups', dataProtection: {}},
			fileHandler: {
				backupMarkdownFile: jest.fn(async () => 'backups/Demo.md'),
				createOrReplaceNewNoteWithData: jest.fn(async (path: string, content: string) => {
					const exists = files.has(`${path}.md`);
					files.set(`${path}.md`, content);
					return exists;
				}),
				deleteFile: jest.fn(async (path: string) => { files.delete(path); }),
			},
		};
		jest.spyOn(UserDataExtractor.prototype, 'extractFromFileAsync').mockResolvedValue({
			identifier: {doubanId: '222', title: 'Demo', type: 'movie'},
		});
		const context = {action: 'Sync', syncConfig: {inheritOldFields: false}, syncStatusHolder: {syncStatus: status}, importError: ''};
		const result = {filePath: 'movies', fileName: 'Demo', content: 'updated content', subject: {id: '222', title: 'Demo'}};
		return {files, plugin, status, context, result, service: new ImportService(plugin as any)};
	}

	it('stops before a destructive write when the requested backup fails', async () => {
		const f = fixture();
		f.plugin.fileHandler.backupMarkdownFile.mockRejectedValue(new Error('disk full'));

		expect(await f.service.createFile(f.context as any, f.result as any)).toBe(false);
		expect(f.files.get('movies/Demo.md')).toBe('original notes');
		expect(f.plugin.fileHandler.createOrReplaceNewNoteWithData).not.toHaveBeenCalled();
		expect(f.plugin.fileHandler.deleteFile).not.toHaveBeenCalled();
		expect(f.status.fail).toHaveBeenCalledWith('222', 'Demo', '备份旧文件失败：movies/Demo.md');
	});

	it('keeps both files and requests review if removing a renamed original fails', async () => {
		const f = fixture('movies/Old title.md');
		f.plugin.settings.syncBackupBeforeReplace = false;
		f.plugin.fileHandler.deleteFile.mockRejectedValue(new Error('delete denied'));

		expect(await f.service.createFile(f.context as any, f.result as any)).toBe(false);
		expect(f.files.get('movies/Old title.md')).toBe('original notes');
		expect(f.files.get('movies/Demo.md')).toBe('updated content');
		expect(f.status.manualReview).toHaveBeenCalledWith('222', 'Demo', 'movies/Demo.md',
			'旧文件删除失败，已保留新旧两个文件：movies/Old title.md');
		expect(f.status.removeFromExistingCache).not.toHaveBeenCalled();
		expect(f.status.create).not.toHaveBeenCalled();
		expect(f.status.replace).not.toHaveBeenCalled();
	});
});
