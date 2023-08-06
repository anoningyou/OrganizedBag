import { ValueTypeEnum } from "../enums/value-type";
import { PropertyAttribute } from "./property-attribute";

export interface Property {
    id: string;
    name: string;
    valueType: ValueTypeEnum;
    attributes: PropertyAttribute[];
}