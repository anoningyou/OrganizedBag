import { Component, Input } from '@angular/core';
import { ValueTypeEnum } from 'src/app/enums/value-type';
import PropertyDto from 'src/app/models/dto/property-dto';

@Component({
  selector: 'app-item-value',
  templateUrl: './item-value.component.html',
  styleUrls: ['./item-value.component.scss']
})
export class ItemValueComponent {
 @Input() property: PropertyDto | null | undefined;
 @Input() value: string | null | undefined;
 valueTypeEnum: typeof ValueTypeEnum = ValueTypeEnum;
}
