import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, CdkDragExit, CdkDragStart} from '@angular/cdk/drag-drop';
import { Item } from 'src/app/models/item';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, of } from 'rxjs';
import PropertyDto from 'src/app/models/dto/property-dto';
import { PropertyParamDto } from 'src/app/models/dto/property-param-dto';
import { ResizeEvent } from 'angular-resizable-element';
import { ItemEditDialogComponent } from 'src/app/modules/dialogs/item-edit-dialog/item-edit-dialog/item-edit-dialog.component';
import { ColumnView } from 'src/app/models/column-view';
import { Property } from 'src/app/models/property';
import { GroupItem} from 'src/app/models/group-item';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {animate, state, style, transition, trigger,keyframes} from '@angular/animations';
import { YesNoComponent } from 'src/app/common/dialog/yes-no/yes-no.component';
import * as kf from 'src/app/constants/keyframes';
import { ComplectsService } from 'src/app/services/complects.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('cardAnimator', [
      transition('* => slideOutRight', animate(300, keyframes(kf.slideOutRight))),
    ])
  ],
})
export class ItemsComponent implements OnInit, OnDestroy{

  //#region inputs

  @Input() isMobile = false;
  @Input() isActive = false;
  @Output() isActiveChange: EventEmitter<void> = new EventEmitter();
  @Input() properties$: Observable<PropertyDto [] | null> = of([]);
  @Input() items$: Observable<Item[] | null> = of([]);

  //#endregion

  //#region fields

  private tempIndexSource = new BehaviorSubject<number | null>(null);
  private tempIndex$ = this.tempIndexSource.asObservable();
  private subsctiptions: Subscription[] = [];

  propertiesSorted$: Observable<PropertyDto []> = of([]);
  propertiesFiltered$: Observable<PropertyDto []> = of([]);
  itemList$: Observable<Item[]> = of([]);
  columnViews$: Observable<ColumnView []> = of([]);
  displayedColumns$: Observable<string []> = of([]);

  expandedElement: Item | null = null;
  slidingElement: Item | null = null;
  dataSource: MatTableDataSource<Item> = new MatTableDataSource();
  @ViewChild(MatTable) table?: MatTable<Item>;

  dragDisabled = true;

  //#endregion
  
  constructor(public itemsService: ItemsService,
    public complectsService: ComplectsService,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.propertiesSorted$ = this.properties$.pipe(map(properties => {
      return [...properties?.sort((a,b) => a.params.listOrder > b.params.listOrder ? 1 : -1) ?? []] 
    }));

    this.propertiesFiltered$ = this.propertiesSorted$.pipe(map(properties => 
      properties.filter(p => p.params.listDisplay)));

    this.columnViews$ = this.propertiesFiltered$
      .pipe(map(properties => this.getColumns(properties)));

    this.displayedColumns$ =  this.columnViews$.pipe(map(columns => {
        return columns.map(c => c.columnDef) ?? [];
      }));

    this.itemList$ = combineLatest({items:  this.items$, tempIndex: this.tempIndex$}).pipe(map(data => {
      if (data.tempIndex === null || !data.items)
        return data.items ?? [];
      else {
        const items = [...data.items];
        items.splice(data.tempIndex + 1, 0, data.items[data.tempIndex]);
        return items;
      }
    }))

    const subsctiption = combineLatest([this.itemList$, this.propertiesFiltered$]).subscribe(data => {
      this.dataSource.data = !!data[0] ? data[0] : [];
      this.table?.renderRows();
    });

    this.subsctiptions.push(subsctiption);
  }

  ngOnDestroy(): void {
    this.subsctiptions.forEach(s =>{s.unsubscribe()})
  }

  //#region properties

  getColumns(properties: PropertyDto[]): ColumnView[] {
    const props: ColumnView[]=  properties.map(p => {
      return {
        columnDef: p.id ?? '',
        header: p.name,
        property: p as Property | null,
        cell: (element: GroupItem) => `${element.values.find(v => v.id === p.id)?.value}`,
        width: `${p.params.complectWidth ?? 50} px`,
        class: 'item__value'
      }
    })?? [];
    
    if (!this.isMobile)
      props.unshift({
        columnDef: 'move-item',
        header: '',
        property: null,
        cell: () => '',
        width: '30px',
        class: 'move'
      }) 
       
    props.push({
      columnDef: 'actions',
      header: '',
      property: null,
      cell: (element: GroupItem) => '',
      width: '30px',
      class: 'actions'
    });
    
    return props;
  }

  //#endregion

  //#region events

  onItemHeaderSelected(param: PropertyParamDto){
    this.itemsService.updatePropertyParam(param);
  }

  onDropHeader(event: CdkDragDrop<PropertyDto[]>) {
    const propertyParams = event.container.data?.map(p => p.params) ?? [];
    moveItemInArray(propertyParams, event.previousIndex, event.currentIndex);
    propertyParams.forEach((param, idx) => {
        param.listOrder = idx;
    });
    this.itemsService.updatePropertyParams(propertyParams);
  }

  onActiveClick() {
    this.isActiveChange.emit();
  }

  onItemClick(item: Item, event: MouseEvent){
    if (this.isMobile)
      return;
    this.expandedElement = this.expandedElement === item ? null : item;
    event.stopPropagation();
  }

  onItemLongPress(item: Item, event: MouseEvent) {
    if (!this.isMobile)
      return;
    this.expandedElement = this.expandedElement === item ? null : item;
      event.stopPropagation();
  }

  onDragEnded() {
    this.tempIndexSource.next(null);
    this.dragDisabled = true;
  }

  onDragStarted(event: CdkDragStart<Item>) {
    if  (event.source.data?.id){
      this.tempIndexSource.next(this.dataSource.data.findIndex(
        (f: any) => f.id === event.source.data.id
      ));
    }
  }

  onItemSwipeRight(item : Item) {
    if (!this.isMobile) {
      this.slidingElement = null
      return;
    }
    
    if (!this.slidingElement){
      this.slidingElement = item;
      this.complectsService.addItemToCurrentGroup(item);
    }   
  }

  onItemSwipeRightEnd(item : Item) {
    this.slidingElement = null;
  }

  //#endregion

  //#region actions

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openEditItemDialog(item: Item, event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  
  openCloneItemDialog(item: Item, event: MouseEvent) {
    event.stopPropagation();
    const newItem = Object.assign(new Item(), item);
    newItem.id = '';

    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: newItem,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDeleteItemDialog(item: Item, event: MouseEvent) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete item?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result)
        this.itemsService.deleteItem(item.id)
    });
  }

  //#endregion

  

  
}
