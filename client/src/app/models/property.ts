import { Guid } from "guid-typescript";
import { ValueTypeEnum } from "../enums/value-type";
import { PropertyAttributeDto } from "./property-attribute-dto";
import { PropertyParamDto } from "./property-param-dto";

export class Property {
    name: string = '';
    valueType: ValueTypeEnum = ValueTypeEnum.String;
    attributes: PropertyAttributeDto[] =[];
    id: string = Guid.EMPTY;
    value: string | undefined | null;
    params: PropertyParamDto | undefined | null;
}