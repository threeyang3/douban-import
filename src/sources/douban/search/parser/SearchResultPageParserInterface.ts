import {SearchPage} from "../../models/SearchPage";
import {SupportType} from "../../../../shared/constants";
import DoubanSearchResultSubject from "../../models/DoubanSearchResultSubject";

export interface SearchResultPageParserInterface {
	support(type:SupportType, pageNum:number):boolean;

	parse(source:string, type:SupportType, pageNum:number, pageSize:number):SearchPage;
}
