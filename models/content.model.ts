import { Global } from "./global.model";

export interface Content {
    _uid:      string;
    global?:   Global[];
    component: string;
    _editable: string;
    body?:     Body[];
    name?:     string;
}