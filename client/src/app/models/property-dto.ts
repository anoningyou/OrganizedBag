import { ValueTypeEnum } from "../enums/value-type";
import { BaseDto } from "./base-dto";
import { PropertyAttributeDto } from "./property-attribute-dto";
import { PropertyParamDto } from "./property-param-dto";

export interface PropertyDto extends BaseDto {
    name: string;
    valueType: ValueTypeEnum;
    attributes: PropertyAttributeDto[];
    params: PropertyParamDto;
}