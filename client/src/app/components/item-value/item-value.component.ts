import { Component, Input } from '@angular/core';
import { Property } from 'src/app/models/property';

@Component({
  selector: 'app-item-value',
  templateUrl: './item-value.component.html',
  styleUrls: ['./item-value.component.scss']
})
export class ItemValueComponent {
 @Input() property: Property = new Property();
}
