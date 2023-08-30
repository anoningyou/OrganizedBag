
import { ValueTypeEnum } from "../enums/value-type";
import { PropertyAttributeDto } from "./dto/property-attribute-dto";
import PropertyDto from "./dto/property-dto";
import { PropertyParamDto } from "./dto/property-param-dto";

export class Property implements PropertyDto {
    name: string = '';
    valueType: ValueTypeEnum = ValueTypeEnum.String;
    attributes: PropertyAttributeDto[] =[];
    id: string = '';
    value: string | undefined | null;
    params: PropertyParamDto = {} as PropertyParamDto;
}