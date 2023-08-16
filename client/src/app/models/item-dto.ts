import { BaseDto } from "./base-dto";
import { PropertyValueDto } from "./property-value-dto";

export interface ItemDto extends BaseDto {
    values: PropertyValueDto[];
}