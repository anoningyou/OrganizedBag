import { Item } from "./item";
import { Property } from "./property";

export class GroupItem extends Item {
    groupId: string | undefined;
    count: number = 1;
}

export class GroupItemView extends Item {
    count: number = 1;
    isGroupBy: boolean = false;
    groupValue: Property = new Property();
    isSummary: boolean = false;
}