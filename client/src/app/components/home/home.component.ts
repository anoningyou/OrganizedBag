import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { GroupItemDto } from 'src/app/models/dto/group-item-dto';
import { ComplectsService } from 'src/app/services/complects.service';
import { ItemsService } from 'src/app/services/items.service';
import { HostListener } from "@angular/core";
import { TabsEnum } from 'src/app/enums/tabs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{
  
  mobileWidth = 992;
  isMobile = false;
  itemsWidth = 300;
  isItemsHidden = false;
  tabsEnum: typeof TabsEnum = TabsEnum;
  activeTab: TabsEnum = TabsEnum.ComplectItems;
  @ViewChild('home', {static: true}) homeElement?: ElementRef;
  @ViewChild('items', {static: true}) itemsElement?: ElementRef;

  private currentComplectSource = new BehaviorSubject<ComplectDto | null>(null);
  currentComplect$ = this.currentComplectSource.asObservable();

  private subsctiptions: Subscription[] = [];

  constructor(public itemsService: ItemsService,
    public complectsService: ComplectsService,
    private deviceService: DeviceDetectorService
    ) {
  }
  
  ngOnInit(): void {
    this.checkMobile();
    const subsctiption = this.complectsService.complects$.subscribe(complects => {
      this.currentComplect$.pipe(take(1)).subscribe(currentComplect => {
        if (!currentComplect && complects.length)
          this.currentComplectSource.next(complects[0]);
        else {
          const complect = complects.find(c => c.id === currentComplect?.id);
          this.currentComplectSource.next(!!complect ? Object.assign({}, complect) as ComplectDto : null);
        }
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

  onCurrentComplectChange(event: ComplectDto | null) {
    this.complectsService.complects$.pipe(take(1)).subscribe(complects => {
        const complect = complects.find(c => c.id === event?.id);
        this.currentComplectSource.next(!!complect ? Object.assign({}, complect) as ComplectDto : null);
      })
  }

  onToggleItems(){
    this.isItemsHidden = !this.isItemsHidden;
  }

  onActiveTabChange(tab: TabsEnum) {
    this.activeTab = tab;
  }

  getItemsWidth() {
    if (this.isMobile)
      return "100%";
    else if (this.isItemsHidden)
      return "0";
    else
      return `${this.itemsWidth}px`;
  }

  getItemsMinWidth() {
    if (this.isMobile)
      return "100%";
    else if (this.isItemsHidden)
      return "0";
    else
      return "200px";
  }

  getItemsStyle(): { [klass: string]: string; } {
    if (this.isMobile)
      return {}
    else
      return {
        'width': this.isItemsHidden? "0" : `${this.itemsWidth}px`,
        'min-width': this.isItemsHidden? "0" : "200px"
    }
  }

  checkMobile(){
    this.isMobile = this.deviceService.isMobile() || this.deviceService.isTablet();
  }

}
