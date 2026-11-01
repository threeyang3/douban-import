import {CheerioAPI} from "cheerio";
import DoubanAbstractLoadHandler from "./DoubanAbstractLoadHandler";
import DoubanSubject from "../models/DoubanSubject";
import {i18nHelper} from "../../../i18n/helper";
import {log} from "../../../shared/Logutil";
import HandleContext from "../models/HandleContext";
import {SupportType, TemplateKey} from "../../../shared/constants";
import {UserStateSubject} from "../models/UserStateSubject";
import {DataField} from "../../../shared/models/DataField";

/**
 * 默认的处理器
 */
export default class DoubanOtherLoadHandler extends DoubanAbstractLoadHandler<DoubanSubject> {
	getSupportType(): SupportType.all {
		return SupportType.all;
	}

	parseVariable(beforeContent: string, variableMap:Map<string, DataField>, extract: DoubanSubject, context: HandleContext): void {
		log.warn(i18nHelper.getMessage('140101'));
	}

	support(extract: DoubanSubject): boolean {
		return false;
	}

	getHighQuantityImageUrl(fileName:string):string{
		return `https://img9.doubanio.com/view/photo/l/public/${fileName}`;
	}

	getSubjectUrl(id:string):string{
		return `https://book.douban.com/subject/${id}/`;
	}

	parseSubjectFromHtml(data: CheerioAPI, context: HandleContext): DoubanSubject {
		log.notice(i18nHelper.getMessage('140101'));
		return undefined;
	}

	analysisUser(html: CheerioAPI, context: HandleContext): { data: CheerioAPI; userState: UserStateSubject } {
		log.notice(i18nHelper.getMessage('140101'));
		return {data: undefined, userState: undefined};
	}


}
