import {CheerioAPI} from "cheerio";
import {DoubanAbstractSyncHandler} from "./DoubanAbstractSyncHandler";
import DoubanBroadcastMovieSubject from "../model/DoubanBroadcastMoveSubject";
import DoubanPlugin from "../../main";
import {SyncType} from "../../shared/constants";
import {SyncConfig} from "../model/SyncConfig";
import HandleContext from "../../sources/douban/models/HandleContext";
import DoubanNoteSubject from "../../sources/douban/models/DoubanNoteSubject";

//TODO will support in future version
export class DoubanNoteSyncHandler extends DoubanAbstractSyncHandler<DoubanNoteSubject> {

	getSyncType(): SyncType {
		return SyncType.note;
	}

	support(t: string): boolean {
		throw new Error("Method not implemented.");
	}

	async sync(syncConfig: SyncConfig, context: HandleContext): Promise<void>{
		return Promise.resolve();
	}



}
