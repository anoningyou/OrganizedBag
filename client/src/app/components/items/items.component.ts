import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, CdkDragExit} from '@angular/cdk/drag-drop';
import { Item } from 'src/app/models/item';
import { BehaviorSubject, Observable, map } from 'rxjs';
import PropertyDto from 'src/app/models/dto/property-dto';
import { PropertyParamDto } from 'src/app/models/dto/property-param-dto';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit{

  @Input() properties: PropertyDto [] | null = [];
  @Input() items: Item[] | null = [];

  private tempIndex: number | null = null;
  
  
  constructor(public itemsService: ItemsService,
    public dialog: MatDialog) {
  }
  ngOnInit(): void {
  }

  get propertiesSorted () {
    return this.properties?.sort((a,b) => a.params.listOrder > b.params.listOrder ? 1 : -1) ?? []
  }

  get propertiesFiltered () {
    return this.propertiesSorted.filter(p => p.params.listDisplay) ?? [];
  }

  get itemList() {
    if (this.tempIndex === null || !this.items)
      return this.items;
    else {
      const items = [...this.items];
      items.splice(this.tempIndex + 1, 0, this.items[this.tempIndex]);
      return items;
    }
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  exited(event: any) {
    if  (event?.container?.data && event.item?.data?.id){
      this.tempIndex = event.container.data.findIndex(
        (f: any) => f.id === event.item.data.id
      );
    }
  }
  entered() {
    this.tempIndex = null;
  }

  getWidth(property: PropertyDto) {
    return `${property.params?.listWidth ?? 50}px`;
  }

  onItemHeaderSelected(param: PropertyParamDto){
    this.itemsService.updatePropertyParam(param);
  }

  dropHeader(event: CdkDragDrop<PropertyDto[]>) {
    const propertyParams = event.container.data?.map(p => p.params) ?? [];
    moveItemInArray(propertyParams, event.previousIndex, event.currentIndex);
    propertyParams.forEach((param, idx) => {
        param.listOrder = idx;
    });
    this.itemsService.updatePropertyParams(propertyParams);
  }

  onResizeEnd(event: ResizeEvent, prop: PropertyDto){
    prop.params.listWidth = event.rectangle.width ?? 50;
    this.itemsService.updatePropertyParam(prop.params);
  }

}
