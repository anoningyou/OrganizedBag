import { GroupItem } from "./group-item";

export interface IGgoupKeys {
    [key: string]: IGgoupKeysValue
}

export interface IGgoupKeysValue {
    name:string;
    items: GroupItem[];
}