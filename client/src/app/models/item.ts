import { Guid } from "guid-typescript";
import { Property } from "./property";

export class Item {
    values: Property[] = [];
    id: string = Guid.EMPTY;
}