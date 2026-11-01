import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanPlugin from "../../main";
import {SyncType} from "../../shared/constants";
import DoubanMusicSubject from "../../sources/douban/models/DoubanMusicSubject";
import DoubanMusicLoadHandler from "../../sources/douban/loaders/DoubanMusicLoadHandler";
import DoubanAbstractListHandler from "./list/DoubanAbstractListHandler";
import {DoubanSubjectState} from "../../sources/douban/user-state";

export class DoubanMusicSyncHandler extends DoubanAbstractSyncHandler<DoubanMusicSubject> {

	getSyncType(): SyncType {
		return SyncType.music;
	}

	constructor(plugin: DoubanPlugin) {
		super(plugin, new DoubanMusicLoadHandler(plugin), [
			DoubanAbstractListHandler.create(SyncType.music, DoubanSubjectState.collect),
			DoubanAbstractListHandler.create(SyncType.music, DoubanSubjectState.wish),
			DoubanAbstractListHandler.create(SyncType.music, DoubanSubjectState.do)]);
	}

}
