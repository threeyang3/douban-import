import {SupportType} from "../../../../shared/constants";

export interface SearchPageFetcherInterface {

	support(type:SupportType, pageNum?:number):boolean;

	fetch(keyword:string, pageNum:number, pageSize:number):Promise<string>;

}
