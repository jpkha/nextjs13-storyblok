import { Component } from "./component.model";
import { LinkModel } from "./link.model";
import { ImageModel } from "./image.model";


export interface Global {
    _uid:          string;
    component:     Component;
    reference?:    string[];
    _editable:     string;
    header_link?:  LinkModel;
    display_name?: string;
    imgSrc?:       ImageModel;
    description?:  string;
}