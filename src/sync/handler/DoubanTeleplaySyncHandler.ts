import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import {SyncType} from "../../shared/constants";
import DoubanPlugin from "../../main";
import DoubanTeleplaySubject from "../../sources/douban/models/DoubanTeleplaySubject";
import {DoubanTeleplayLoadHandler} from "../../sources/douban/loaders/DoubanTeleplayLoadHandler";
import DoubanAbstractListHandler from "./list/DoubanAbstractListHandler";
import {DoubanSubjectState} from "../../sources/douban/user-state";

export class DoubanTeleplaySyncHandler extends DoubanAbstractSyncHandler<DoubanTeleplaySubject>{

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanTeleplayLoadHandler(plugin),[
			DoubanAbstractListHandler.create(SyncType.teleplay, DoubanSubjectState.collect),
			DoubanAbstractListHandler.create(SyncType.teleplay, DoubanSubjectState.wish),
			DoubanAbstractListHandler.create(SyncType.teleplay, DoubanSubjectState.do)]);
	}

	getSyncType(): SyncType {
		return SyncType.teleplay;
	}

}
