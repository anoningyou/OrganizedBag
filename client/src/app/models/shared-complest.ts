import { ComplectDto } from "./dto/complect-dto";
import PropertyDto from "./dto/property-dto";
import { Item } from "./item";

export interface SharedComplect {
    complect: ComplectDto;
    items: Item[];
    properties: PropertyDto[];
}