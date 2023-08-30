import { Component, OnInit } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { take } from 'rxjs';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { GroupItemDto } from 'src/app/models/dto/group-item-dto';
import { ComplectsService } from 'src/app/services/complects.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  
  itemsWidth = '300px';
  currentComplect: ComplectDto | null = null;

  constructor(public itemsService: ItemsService,
    public complectsService: ComplectsService
    ) {
  }
  ngOnInit(): void {
    this.itemsService.loadAll();
    this.complectsService.loadComplects().pipe(take(1)).subscribe(complects => {
      if (complects?.length)
        this.currentComplect = complects[0];
    })
  }

  onItemsResizeEnd(event: ResizeEvent) {
    this.itemsWidth = `${event.rectangle.width ?? 50}px`;
  }

  onComplectItemUpdated(event: GroupItemDto) {
    this.complectsService.updateGroupItem(event);
  }
}
