import HandleContext from "../../../sources/douban/models/HandleContext";
import {SyncConfig} from "../../model/SyncConfig";
import {SearchPage} from "../../../sources/douban/models/SearchPage";

export interface DoubanListHandler {
	getDoType?(): string;

	getPageData(context: HandleContext):Promise<SearchPage>;

	support(config:SyncConfig):boolean;
}
