import { ItemDto } from "../models/dto/item-dto";
import PropertyDto from "../models/dto/property-dto";
import { Item } from "../models/item";
import { Property } from "../models/property";

export abstract class ItemsManager {
    static getItem(dto: ItemDto, properties: PropertyDto[]) : Item{
        const item = Object.assign(new Item(), dto) as Item;
        item.values = properties.map((prop) => {
          const value = dto.values.find((v) => v.propertyId === prop.id);
          const propertyValue = Object.assign(new Property(), prop) as Property;
          propertyValue.value = value?.value;
          return propertyValue;
        });
        return item;
    }
}