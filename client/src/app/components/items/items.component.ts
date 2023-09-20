import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, CdkDragExit} from '@angular/cdk/drag-drop';
import { Item } from 'src/app/models/item';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';
import PropertyDto from 'src/app/models/dto/property-dto';
import { PropertyParamDto } from 'src/app/models/dto/property-param-dto';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemsComponent implements OnInit{

  @Input() properties$: Observable<PropertyDto [] | null> = of([]);
  @Input() items$: Observable<Item[] | null> = of([]);

  propertiesSorted$: Observable<PropertyDto []> = of([]);
  propertiesFiltered$: Observable<PropertyDto []> = of([]);
  itemList$: Observable<Item[]> = of([]);

  private tempIndexSource = new BehaviorSubject<number | null>(null);
  private tempIndex$ = this.tempIndexSource.asObservable();
  
  constructor(public itemsService: ItemsService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.propertiesSorted$ = this.properties$.pipe(map(properties => {
      return [...properties?.sort((a,b) => a.params.listOrder > b.params.listOrder ? 1 : -1) ?? []] 
    }));

    this.propertiesFiltered$ = this.propertiesSorted$.pipe(map(properties => 
      properties.filter(p => p.params.listDisplay)));

    this.itemList$ = combineLatest({items:  this.items$, tempIndex: this.tempIndex$}).pipe(map(data => {
      if (data.tempIndex === null || !data.items)
        return data.items ?? [];
      else {
        const items = [...data.items];
        items.splice(data.tempIndex + 1, 0, data.items[data.tempIndex]);
        return items;
      }
    }))
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
      this.tempIndexSource.next(event.container.data.findIndex(
        (f: any) => f.id === event.item.data.id
      ));
    }
  }
  entered() {
    this.tempIndexSource.next(null);
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
