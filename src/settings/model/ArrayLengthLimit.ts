import {SupportType} from "../../shared/constants";

export interface ArrayLengthLimit {
	type: SupportType;
	field: string;
	limit: number;
}
