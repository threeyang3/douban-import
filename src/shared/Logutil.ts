import {moment, Notice} from "obsidian";
import {i18nHelper} from "../i18n/helper";

export default class Logger {


	public error(msg: any, e:any): any {
		new Notice(msg);
		console.log(`Douban Import: ${msg}`);
		console.error(e);
		return e;
	}

	public notice(e: any): any {
		new Notice(e);
		console.error(`Douban Import: ${e}`);
		return e;
	}

	public warn(e: any): any {
		new Notice(e);
		console.warn(`Douban Import: ${e}`);
		return e;
	}

	public info(e: any): any {
		console.log(`Douban Import:` + `${typeof e == 'string' ? e : JSON.stringify(e)}`);
		return e;
	}

	public debug(e: any): any {
		if (!e) {
			return e;
		}
		if(e instanceof Error) {
			console.error(e);
		}else {
			try {
				let showMessage = typeof e == 'string' ? e : e.toString();
				console.log(`Douban Import:${moment(new Date()).format('YYYY-MM-DD HH:mm:SS')}: ${showMessage}`);
			}catch (e) {
				console.log(`Douban Import:${moment(new Date()).format('YYYY-MM-DD HH:mm:SS')}:` + e.toString());
			}
		}
		return e;
	}

	public trace(e: any): any {
		// return e;
		console.log(`Douban Import:` + `${typeof e == 'string' ? e : JSON.stringify(e)}`);
		return e;
	}

	public traceN(notion: string, e: any): any {
		// return e;
		console.log(`${notion} ${typeof e == 'string' ? e : JSON.stringify(e)}`);
		return e;
	}
}

export const log: Logger = new Logger();
