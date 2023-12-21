import { ValueTypeEnum } from "src/app/enums/value-type";
import { PropertyAttributeDto } from "../dto/property-attribute-dto";

export interface ExportProperty {
    id: string;
    name: string;
    valueType: ValueTypeEnum;
    attributes: PropertyAttributeDto[];
    value: string | undefined | null;
}