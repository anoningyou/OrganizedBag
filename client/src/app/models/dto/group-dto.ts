import { BaseDto } from "./base-dto";
import { GroupItemDto } from "./group-item-dto";

export interface GroupDto extends BaseDto {
    name: string;
    complectId: string;
    items: GroupItemDto[];
}