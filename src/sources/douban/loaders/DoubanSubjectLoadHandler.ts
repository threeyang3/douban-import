import DoubanSubject from "../models/DoubanSubject";
import HandleContext from "../models/HandleContext";
import HandleResult from "../models/HandleResult";

export default interface DoubanSubjectLoadHandler<T extends DoubanSubject> {

	parse(extract: T, context: HandleContext): Promise<HandleResult>;

	support(extract: DoubanSubject): boolean;

	handle(id: string, context: HandleContext): Promise<T>;

	handleHtml?(id: string, html: string, context: HandleContext): Promise<T>;

}
