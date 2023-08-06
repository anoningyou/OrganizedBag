import { PropertyAttributeTypeEnum } from "../enums/property-attribute-type";

export interface PropertyAttribute {
    type: PropertyAttributeTypeEnum;
    value: string;
}