import type DoubanImportPlugin from '../main';
import type HandleContext from '../sources/douban/models/HandleContext';
import {SEARCH_ITEM_PAGE_SIZE, SupportType} from '../shared/constants';
import SearcherV2 from '../sources/douban/search/SearchV2';
import {DoubanFuzzySuggester} from '../sources/douban/search/DoubanSearchFuzzySuggestModal';
import {DoubanSearchModal} from '../sources/douban/search/DoubanSearchModal';
import {i18nHelper} from '../i18n/helper';
import {log} from '../shared/Logutil';

/** Connects explicit search actions to the Douban source and selection UI. */
export default class SearchService {
	constructor(private readonly plugin: DoubanImportPlugin) {}

	async search(term: string, type: SupportType, context: HandleContext): Promise<void> {
		const plugin = this.plugin;
		try {
			plugin.showStatus(i18nHelper.getMessage('140201', term));
			const page = await SearcherV2.search(
				term, type, 1, SEARCH_ITEM_PAGE_SIZE, plugin.settings, plugin.settingsManager,
			);
			plugin.showStatus(i18nHelper.getMessage('140202', page.total));
			context.searchPage = page;
			new DoubanFuzzySuggester(plugin, context, term).showSearchPage(page);
		} catch (error) {
			log.error(i18nHelper.getMessage('140206', error.message), error);
		} finally {
			plugin.clearStatusBarDelay();
		}
	}

	async searchActiveFile(context: HandleContext): Promise<void> {
		const file = this.plugin.app.workspace.getActiveFile();
		if (file?.basename) await this.plugin.search(file.basename, SupportType.all, context);
	}

	open(context: HandleContext, type: SupportType | null = null): void {
		new DoubanSearchModal(this.plugin.app, this.plugin, context, type).open();
	}
}
