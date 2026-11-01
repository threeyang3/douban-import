import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanPlugin from "../../main";
import {SyncType} from "../../shared/constants";
import DoubanBookSubject from "../../sources/douban/models/DoubanBookSubject";
import DoubanBookLoadHandler from "../../sources/douban/loaders/DoubanBookLoadHandler";
import DoubanAbstractListHandler from "./list/DoubanAbstractListHandler";
import {DoubanSubjectState} from "../../sources/douban/user-state";

export class DoubanBookSyncHandler extends DoubanAbstractSyncHandler<DoubanBookSubject> {

	constructor(plugin:DoubanPlugin) {
		super(plugin, new DoubanBookLoadHandler(plugin),[
			DoubanAbstractListHandler.create(SyncType.book, DoubanSubjectState.collect),
			DoubanAbstractListHandler.create(SyncType.book, DoubanSubjectState.wish),
			DoubanAbstractListHandler.create(SyncType.book, DoubanSubjectState.do)]);
	}

    getSyncType(): SyncType {
		return SyncType.book;
    }

}
