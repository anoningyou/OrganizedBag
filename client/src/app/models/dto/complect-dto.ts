import { BaseDto } from "./base-dto";
import { GroupDto } from "./group-dto";

export interface ComplectDto extends BaseDto {
    name: string;
    description: string;
    groups: GroupDto [];
}