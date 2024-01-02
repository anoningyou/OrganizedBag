import { ExportProperty } from "./export-property";

export interface ExportItem {
    id?: string;
    count: number;
    values: ExportProperty[];
}