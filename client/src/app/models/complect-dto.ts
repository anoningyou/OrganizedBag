import { BaseDto } from "./base-dto";
import { ComplectItemDto } from "./complect-item-dto";

export interface ComplectDto extends BaseDto {
    name: string;
    description: string;
    items: ComplectItemDto [];
}