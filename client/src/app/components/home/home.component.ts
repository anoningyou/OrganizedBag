import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { GroupItemDto } from 'src/app/models/dto/group-item-dto';
import { ComplectsService } from 'src/app/services/complects.service';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{
  
  itemsWidth = 300;
  get itemsWidthPx() {return `${this.itemsWidth}px`}
  showComplects = true;
  @ViewChild('home', {static: true}) homeElement?: ElementRef;
  @ViewChild('items', {static: true}) itemsElement?: ElementRef;

  private currentComplectSource = new BehaviorSubject<ComplectDto | null>(null);
  currentComplect$ = this.currentComplectSource.asObservable();

  private subsctiptions: Subscription[] = [];

  constructor(public itemsService: ItemsService,
    public complectsService: ComplectsService
    ) {
  }
  

  ngOnInit(): void {
    this.itemsService.loadAll();

    this.complectsService.loadComplects().pipe(take(1)).subscribe(complects => {
      if (complects?.length)
        this.currentComplectSource.next(complects[0])
    });

    const subsctiption =  this.complectsService.complects$.subscribe(complects => {
      this.currentComplect$.pipe(take(1)).subscribe(currentComplect => {
        const complect = complects.find(c => c.id === currentComplect?.id);
        //console.log(complect)
        this.currentComplectSource.next(!!complect ? Object.assign({}, complect) as ComplectDto : null);
      })
    });
    this.subsctiptions.push(subsctiption);
  }

  ngOnDestroy(): void {
    this.subsctiptions.forEach(s =>{s.unsubscribe()})
  }

  onItemsResizeEnd(event: ResizeEvent) {
    this.itemsWidth = event.rectangle.width ?? 50;
  }

  onComplectItemUpdated(event: GroupItemDto) {
    this.complectsService.updateGroupItem(event);
  }

  onCurrentComplectChange(event: ComplectDto | null) {
    this.complectsService.complects$.pipe(take(1)).subscribe(complects => {
        const complect = complects.find(c => c.id === event?.id);
        this.currentComplectSource.next(!!complect ? Object.assign({}, complect) as ComplectDto : null);
      })
  }


}
