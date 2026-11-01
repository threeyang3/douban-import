
import {DoubanPluginSetting} from "../../../settings/model/DoubanPluginSetting";
import {SearchPage} from "../models/SearchPage";
import SettingsManager from "../../../settings/SettingsManager";
import {SupportType} from "../../../shared/constants";
import {SearchPageFetcher} from "./searcher/SearchPageFetcher";
import {SearchResultPageParser} from "./parser/SearchResultPageParser";

export default class SearcherV2 {
	static search(searchItem: string, searchType: SupportType, pageNum:number, pageSize:number, doubanSettings: DoubanPluginSetting, settingsManager:SettingsManager): Promise<SearchPage> {
		return new SearchPageFetcher(settingsManager)
			.fetch(searchItem, searchType, pageNum, pageSize)
			.then(e => new SearchResultPageParser()
				.parse(e, searchType, pageNum, pageSize));
	}

}
