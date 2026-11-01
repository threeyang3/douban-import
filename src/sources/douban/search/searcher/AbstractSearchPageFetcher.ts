import { SupportType } from "../../../../shared/constants";
import SettingsManager from "../../../../settings/SettingsManager";
import {SearchPageFetcherInterface} from "./SearchPageFetcherInterface";
import HttpUtil from "../../../../platform/network/HttpUtil";
import {log} from "../../../../shared/Logutil";
import {i18nHelper} from "../../../../i18n/helper";
import {DoubanHttpUtil} from "../../http";
import {Platform} from "obsidian";
import DoubanPageGuard from "../../parsing/DoubanPageGuard";

export abstract class AbstractSearchPageFetcher implements SearchPageFetcherInterface {

	protected settingsManager: SettingsManager;

	constructor(settingsManager: SettingsManager) {
		this.settingsManager = settingsManager;
	}

	support(type: SupportType, pageNum?:number): boolean {
        throw new Error("Method not implemented.");
	}

	fetch(keyword: string, pageNum: number, pageSize: number): Promise<string> {
		const start:number = Math.floor((pageNum - 1) * pageSize);
		const url:string = this.getSearchUrl(keyword, start, pageSize);
		if (!url) {
			return Promise.resolve("");
		}
		return DoubanHttpUtil.httpRequestGet(url, this.settingsManager.getHeaders(), this.settingsManager)
			.then(html => {
				DoubanPageGuard.assertCanParse(html, {allowFragment: true});
				return html;
			})
			.catch(e => {
				const detail = DoubanPageGuard.describeError(e);
				throw log.error(i18nHelper.getMessage('130101').replace('{0}', detail), e);
			});
	}

	getSearchUrl(keyword: string, start: number, pageSize: number):string {
		keyword = keyword.trim();
		if (keyword.length == 0) {
			return "";
		}
		keyword = HttpUtil.encodeUrl(keyword);
		return this.getUrl(keyword, start, pageSize)
	}

	abstract getUrl(keyword: string, start: number, pageSize: number):string;


}
