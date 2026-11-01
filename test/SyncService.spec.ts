import SyncService from '../src/app/SyncService';

jest.mock('obsidian', () => new Proxy(jest.requireActual('./mocks/obsidian'), {
	get: (target, key) => key in target ? target[key] : class {},
}));

describe('sync service completion', () => {
	it('clears the active context and status bar even when saving completion fails', async () => {
		const error = new Error('settings could not be saved');
		const plugin = {
			checkLogin: jest.fn(async () => false),
			statusHolder: {completeSync: jest.fn(async () => { throw error; })},
			clearStatusBarDelay: jest.fn(),
		};
		const context = {plugin, syncActive: true};
		const service = new SyncService(plugin as any);

		await expect(service.sync(context as any)).rejects.toBe(error);
		expect(context.syncActive).toBe(false);
		expect(plugin.clearStatusBarDelay).toHaveBeenCalledTimes(1);
		expect(plugin.statusHolder.completeSync).toHaveBeenCalledTimes(1);
	});
});
