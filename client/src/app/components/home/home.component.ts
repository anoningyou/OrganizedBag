import { Component, OnInit } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  itemsWidth = 'auto';

  constructor(public itemsService: ItemsService) {
  }
  ngOnInit(): void {
    this.itemsService.loadAll();
  }

  onItemsResizeEnd(event: ResizeEvent) {
    this.itemsWidth = `${event.rectangle.width ?? 50}px`;
  }
}
