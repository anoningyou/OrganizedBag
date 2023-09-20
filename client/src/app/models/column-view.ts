import { GroupItem } from "./group-item";
import { Property } from "./property";

export interface ColumnView {
    columnDef: string;
    header: string;
    property: Property | null;
    cell: (element: GroupItem) => string;
    width: string;
    class: string;
}