import { PropertyAttributeTypeEnum } from "../enums/property-attribute-type";

export interface PropertyAttributeDto {
    type: PropertyAttributeTypeEnum;
    value: string;
}