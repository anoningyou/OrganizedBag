import { ComplectDto } from "./complect-dto";
import { ItemDto } from "./item-dto";
import PropertyDto from "./property-dto";

export interface SharedComplectDto {
    complect: ComplectDto;
    items: ItemDto[];
    properties: PropertyDto[];
}