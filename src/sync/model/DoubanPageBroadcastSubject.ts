import DoubanSubject from '../../sources/douban/models/DoubanSubject';

export default class DoubanPageBroadcastSubject extends DoubanSubject {
	pageNumber: number;
	broadcast: DoubanPageBroadcastSubject[];
	pageSize: number;
}
