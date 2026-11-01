import {CheerioAPI} from 'cheerio';
import DoubanAbstractLoadHandler from '../../sources/douban/loaders/DoubanAbstractLoadHandler';
import DoubanNoteSubject from '../model/DoubanPageBroadcastSubject';
import DoubanPageBroadcastSubject from '../model/DoubanPageBroadcastSubject';
import DoubanPlugin from "../../main";
import DoubanSubject from '../../sources/douban/models/DoubanSubject';
import HandleContext from "../../sources/douban/models/HandleContext";
import {SupportType} from "../../shared/constants";
import { UserStateSubject } from '../../sources/douban/models/UserStateSubject';

//TODO will support in future version
class DoubanPageBroadcastLoadHandler extends DoubanAbstractLoadHandler<DoubanPageBroadcastSubject> {
    getSubjectUrl(id: string): string {
        throw new Error('Method not implemented.');
    }
    getHighQuantityImageUrl(fileName: string): string {
        throw new Error('Method not implemented.');
    }

	constructor(doubanPlugin: DoubanPlugin) {
		super(doubanPlugin);
	}

	getSupportType(): SupportType {
		return null;
	}

	parseVariable(beforeContent: string, variableMap:Map<string, any>, extract: DoubanNoteSubject, context: HandleContext): void {
		return null;
	}

	support(extract: DoubanSubject): boolean {
		return extract && extract.type && (extract.type.contains("广播") || extract.type.contains("Broadcast"));
	}

	parseSubjectFromHtml(html: CheerioAPI, context: HandleContext): DoubanPageBroadcastSubject {
		return null;
	}

	analysisUser(html: CheerioAPI, context: HandleContext): { data: CheerioAPI; userState: UserStateSubject } {
		return {data: undefined, userState: undefined};
	}


}
