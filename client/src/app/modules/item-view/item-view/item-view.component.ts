import { Component, Input } from '@angular/core';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss']
})
export class ItemViewComponent {
  @Input() item: Item | undefined
}
