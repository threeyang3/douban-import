import DoubanPlugin from "../../../main";
import { DoubanPluginSetting } from "../../../settings/model/DoubanPluginSetting";
import DoubanSubject from "./DoubanSubject";
import {Editor} from "obsidian";
import GlobalStatusHolder from "../../../sync/GlobalStatusHolder";
import NetFileHandler from "../../../platform/network/NetFileHandler";
import {SearchHandleMode} from "../../../shared/constants";
import {SearchPageInfo} from "./SearchPageInfo";
import {SearchResultsPage} from "schema-dts";
import {SyncConfig} from "../../../sync/model/SyncConfig";
import SyncStatusHolder from "../../../sync/model/SyncStatusHolder";
import UserComponent from "../auth/UserComponent";

export default interface HandleContext {
	plugin:DoubanPlugin;
	mode:SearchHandleMode;
	settings: DoubanPluginSetting;
	editor?:Editor;
	userComponent: UserComponent;
	netFileHandler: NetFileHandler;
	showAfterCreate?:boolean;
	syncStatusHolder?:GlobalStatusHolder;
	action:string;
	syncConfig?: SyncConfig;
	listItem?:DoubanSubject;
	syncActive?:boolean;

	searchPage?:SearchPageInfo;
	syncOffset?:number;
	syncPreviewMode?:boolean;
	importError?:string;

}
