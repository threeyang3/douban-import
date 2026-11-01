import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import {SyncType} from "../../shared/constants";
import DoubanPlugin from "../../main";
import DoubanGameLoadHandler from "../../sources/douban/loaders/DoubanGameLoadHandler";
import DoubanGameSubject from "../../sources/douban/models/DoubanGameSubject";
import DoubanAbstractListHandler from "./list/DoubanAbstractListHandler";
import {DoubanSubjectState} from "../../sources/douban/user-state";

export class DoubanGameSyncHandler extends DoubanAbstractSyncHandler<DoubanGameSubject>{

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanGameLoadHandler(plugin),[
			DoubanAbstractListHandler.create(SyncType.game, DoubanSubjectState.collect),
			DoubanAbstractListHandler.create(SyncType.game, DoubanSubjectState.wish),
			DoubanAbstractListHandler.create(SyncType.game, DoubanSubjectState.do)]);
	}

	getSyncType(): SyncType {
		return SyncType.game;
	}

}
