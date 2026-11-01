import SettingsStore from '../src/app/SettingsStore';

const media = ['movie', 'book', 'music', 'note', 'game', 'teleplay', 'theater'] as const;

describe('settings persistence and legacy template migration', () => {
	it('migrates every legacy template path before builtin defaults can mask it', async () => {
		const raw = Object.fromEntries(media.map(type => [`${type}TemplateFile`, ` Templates/${type}.md `]));
		const persistence = {loadData: jest.fn(async () => raw), saveData: jest.fn(async () => {})};
		const settings = await new SettingsStore(persistence).load();

		for (const type of media) {
			expect(settings[`${type}TemplateConfig`]).toEqual({source: 'file', filePath: `Templates/${type}.md`});
		}
		expect(raw).not.toHaveProperty('movieTemplateConfig');
		expect(persistence.saveData).not.toHaveBeenCalled();
	});

	it('accepts an exported envelope containing historical string configs', () => {
		const raw = Object.fromEntries(media.map(type => [`${type}TemplateConfig`, ` Templates/${type}.md `]));
		const settings = SettingsStore.decode({version: '1.0', settings: raw});
		for (const type of media) {
			expect(settings[`${type}TemplateConfig`]).toEqual({source: 'file', filePath: `Templates/${type}.md`});
		}
		expect(raw.movieTemplateConfig).toBe(' Templates/movie.md ');
	});

	it('preserves an explicit builtin or custom choice over an old file path', () => {
		const settings = SettingsStore.decode({
			movieTemplateFile: 'old/movie.md', movieTemplateConfig: {source: 'builtin'},
			bookTemplateFile: 'old/book.md', bookTemplateConfig: {source: 'custom', customContent: '# {{title}}'},
		});
		expect(settings.movieTemplateConfig).toEqual({source: 'builtin'});
		expect(settings.bookTemplateConfig).toEqual({source: 'custom', customContent: '# {{title}}'});
	});

	it('persists the current settings passed by the host after a replacement import', async () => {
		const persistence = {loadData: jest.fn(async () => null), saveData: jest.fn(async (_value: unknown) => {})};
		const store = new SettingsStore(persistence);
		await store.load();
		const imported = SettingsStore.decode({dataFilePath: 'Imported library'});
		await store.save(imported);
		expect(persistence.saveData).toHaveBeenCalledWith(imported);
	});
});
