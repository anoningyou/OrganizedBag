import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ResizeEvent } from 'angular-resizable-element';
import { BehaviorSubject, Subscription, take } from 'rxjs';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { ComplectsService } from 'src/app/services/complects.service';
import { ItemsService } from 'src/app/services/items.service';
import { TabsEnum } from 'src/app/enums/tabs';
import { DeviceDetectorService } from 'ngx-device-detector';
import { GroupDto } from 'src/app/models/dto/group-dto';
import { PropertyParamDto } from 'src/app/models/dto/property-param-dto';
import { ImportService } from 'src/app/services/import.service';
import { ScreenStateStore } from 'src/app/stores/screen.store';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy{
  
  mobileWidth = 992;
  itemsWidth = 300;
  isItemsHidden = false;
  tabsEnum: typeof TabsEnum = TabsEnum;
  activeTab: TabsEnum = TabsEnum.ComplectItems;
  @ViewChild('home', {static: true}) homeElement?: ElementRef;
  @ViewChild('items', {static: true}) itemsElement?: ElementRef;

  private subsctiptions: Subscription[] = [];
  screenStateStore = inject(ScreenStateStore);

  constructor(public itemsService: ItemsService,
    public complectsService: ComplectsService,
    private importService: ImportService
    ) {
  }
  
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subsctiptions.forEach(s =>{s.unsubscribe()})
  }

  onItemsResizeEnd(event: ResizeEvent) {
    this.itemsWidth = event.rectangle.width ?? 50;
  }

  onCurrentComplectChange(event: ComplectDto | null) {
    this.complectsService.setCurrentComplect(event);
  }

  onCurrentCategoryChange(event: GroupDto | null){
    this.complectsService.setCurrentGroup(event);
  }

  onPropertyParamChange(propertyParam: PropertyParamDto) {
    this.itemsService.updatePropertyParam(propertyParam);
  }

  onPropertyParamsChange(propertyParams: PropertyParamDto[]) {
    this.itemsService.updatePropertyParams(propertyParams);
  }

  onToggleItems(){
    this.isItemsHidden = !this.isItemsHidden;
  }

  onActiveTabChange(tab: TabsEnum) {
    this.activeTab = tab;
  }

  importComplect(file: File){
    this.importService.importComplect(file);
  }

  getItemsWidth() {
    if (this.screenStateStore.isMobilePortrait())
      return "100%";
    else if (this.isItemsHidden)
      return "0";
    else
      return `${this.itemsWidth}px`;
  }

  getItemsMinWidth() {
    if (this.screenStateStore.isMobilePortrait())
      return "100%";
    else if (this.isItemsHidden)
      return "0";
    else
      return "200px";
  }

  getItemsStyle(): { [klass: string]: string; } {
    if (this.screenStateStore.isMobilePortrait())
      return {}
    else
      return {
        'width': this.isItemsHidden? "0" : `${this.itemsWidth}px`,
        'min-width': this.isItemsHidden? "0" : "200px"
    }
  }
}
