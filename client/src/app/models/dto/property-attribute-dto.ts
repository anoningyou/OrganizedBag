import { PropertyAttributeTypeEnum } from "src/app/enums/property-attribute-type";

export interface PropertyAttributeDto {
    type: PropertyAttributeTypeEnum;
    value: string;
}