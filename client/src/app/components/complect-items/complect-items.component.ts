import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, OnChanges, SimpleChanges, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { GroupItemDto } from 'src/app/models/dto/group-item-dto';
import { PropertyParamDto } from 'src/app/models/dto/property-param-dto';
import PropertyDto from 'src/app/models/dto/property-dto';
import { Item } from 'src/app/models/item';
import { GroupItem, GroupItemView } from 'src/app/models/group-item';
import { Property } from 'src/app/models/property';
import { ItemsService } from 'src/app/services/items.service';
import { ComplectEditDialogComponent } from '../complect-edit-dialog/complect-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray } from '@angular/cdk/drag-drop';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';
import { YesNoComponent } from 'src/app/common/dialog/yes-no/yes-no.component';
import { ValueTypeEnum } from 'src/app/enums/value-type';
import { GroupDto } from 'src/app/models/dto/group-dto';
import { ComplectsService } from 'src/app/services/complects.service';
import { GroupEditDialogComponent } from '../group-edit-dialog/group-edit-dialog.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, of, take } from 'rxjs';
import { ColumnView } from 'src/app/models/column-view';
import { v4 as uuidv4 } from 'uuid';
import { EditCountComponent } from 'src/app/common/dialog/edit-count/edit-count.component';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-complect-items',
  templateUrl: './complect-items.component.html',
  styleUrls: ['./complect-items.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ComplectItemsComponent implements OnInit, OnDestroy {

//#region fields

  categoryGroupId = 'category';
  dataSource: MatTableDataSource<GroupItemView> = new MatTableDataSource();
  @ViewChild(MatTable) table?: MatTable<GroupItemView>;

  private groupPropertyIdSource = new BehaviorSubject<string | null>(this.categoryGroupId);
  groupPropertyId$ = this.groupPropertyIdSource.asObservable();

  groups$: Observable<GroupDto[] | null> = of([]);

  propertiesSorted$: Observable<PropertyDto []> = of([]);
  propertiesFiltered$: Observable<PropertyDto []> = of([]);

  columnViews$: Observable<ColumnView []> = of([]);

  displayedColumns$: Observable<string []> = of([]);
  
  private subsctiptions: Subscription[] = [];

  dragDisabled = true;

  expandedElement: GroupItemView | null = null;
  

//#endregion

//#region inputs

  @Input() isMobile = false;
  @Input() isActive = false;
  @Output() isActiveChange: EventEmitter<void> = new EventEmitter();
  @Input() properties$: Observable<PropertyDto [] | null> = of([]);
  @Input() items$: Observable<Item[] | null> = of([]);
  @Input() complect$: Observable<ComplectDto | null> = of(null);

  @Input() showChart = false;
  @Output() showChartChange: EventEmitter<boolean> = new EventEmitter();

  @Output() complectChange: EventEmitter<ComplectDto | null> = new EventEmitter();

  @Input() currentCategoryId: string | undefined;
  @Output() currentCategoryIdChange: EventEmitter<string | undefined> = new EventEmitter();
//#endregion

//#region events

  @Output() complectItemUpdated: EventEmitter<GroupItemDto> = new EventEmitter();
  
//#endregion

  constructor(public itemsService: ItemsService,
    public complectsService: ComplectsService,
    public dialog: MatDialog,
    public toastr: ToastrService) {
  }

//#region event listeners

  ngOnInit(): void {
    this.groups$ = this.complect$.pipe(map(c => c?.groups ?? []))

    this.propertiesSorted$ = this.properties$.pipe(map(properties => {
      return [...properties?.sort((a,b) => a.params.complectOrder > b.params.complectOrder ? 1 : -1) ?? []] 
    }));

    this.propertiesFiltered$ = this.propertiesSorted$.pipe(map(properties => 
      properties.filter(p => p.params.complectDisplay)));

    this.columnViews$ = combineLatest([this.propertiesFiltered$, this.groupPropertyId$, this.complect$])
      .pipe(map(data => this.getColumns(data[0], data[1], data[2])));

    this.displayedColumns$ =  this.columnViews$.pipe(map(columns => {
        return columns.map(c => c.columnDef) ?? [];
      }));
    
    const subsctiption = combineLatest([this.groups$, this.items$, this.propertiesFiltered$,  this.groupPropertyId$]).subscribe(data => {
      this.dataSource.data = !!data[0] && !!data[1] ? this.getComplectItemViews(data[0], data[1], data[2], data[3]) : [];
      this.table?.renderRows();
    });

    this.subsctiptions.push(subsctiption);

    this.complect$.subscribe(c => {
      if (c?.groups?.findIndex(g => g.id === this.currentCategoryId) ?? -1 === -1)
        this.onCurrentCategoryIdChanged(!!c?.groups?.length ? c.groups[0].id : undefined)
    })
  }

  ngOnDestroy(): void {
    this.subsctiptions.forEach(s =>{s.unsubscribe()})
  }

  onGroupPropertyIdChanged(id: string) {
    this.groupPropertyIdSource.next(id);
  }

  onTableHeaderSelected(param: PropertyParamDto){
    this.itemsService.updatePropertyParam(param);
  }

  onHeaderDrop (event: CdkDragDrop<PropertyDto[]>) {
    const propertyParams = event.container.data?.map(p => p.params) ?? [];
    moveItemInArray(propertyParams, event.previousIndex, event.currentIndex);
    propertyParams.forEach((param, idx) => {
      param.complectOrder = idx;
    });
    this.itemsService.updatePropertyParams(propertyParams);
  }

  onItemDrop (event: CdkDragDrop<any>) {
    this.dragDisabled = true;
    this.complect$.pipe(take(1)).subscribe(complect => {
      if (!complect)
        return;

        const newGroupElementIndex = event.currentIndex === 0 ? 1 : event.currentIndex - 1;
      let newGroupElement = event.container.data.data[newGroupElementIndex];
      if (!newGroupElement)
        return;

      if (!newGroupElement.groupId)
        newGroupElement = event.container.data.data[newGroupElementIndex - 1];

      if (event.previousContainer === event.container) {
        const item = event.previousContainer.data.data[event.previousIndex];
        this.changeItemGroup(item.id, item.groupId, newGroupElement.groupId);
      } 
      else {
        const item = event.previousContainer.data[event.previousIndex];
        const group = complect.groups.find(g => g.id === newGroupElement.groupId) ?? complect.groups[0];
        this.complectsService.addItemToGroup(item, group);
      }
    })
  }

  onItemDropMobile (event: CdkDragDrop<any>) {
    this.complect$.pipe(take(1)).subscribe(complect => {
      if (!complect || !this.currentCategoryId)
        return;
      const group = complect.groups.find(g => g.id === this.currentCategoryId);
      if (!group)
        return;
      const item = event.previousContainer.data[event.previousIndex];
      this.complectsService.addItemToGroup(item, group);
    })
  }

  onChartToggleClick() {
    this.showChart = !this.showChart;
    this.showChartChange.emit(this.showChart);
  }
  
  onActiveClick() {
    this.isActiveChange.emit()
  }

  onCurrentCategoryIdChanged(value: string | undefined) {
    this.currentCategoryIdChange.emit(value)
    this.currentCategoryId = value;
  }

  onItemClick(item: GroupItemView){
    this.expandedElement = this.expandedElement === item ? null : item;
  }

  onExpandButtonClick(item: GroupItemView){
    this.expandedElement = this.expandedElement === item ? null : item;
  }
  

//#endregion

//#region properties

  getColumns(properties: PropertyDto[], groupPropertyId: string | null, complect: ComplectDto | null): ColumnView[] {
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
    
    if (groupPropertyId !== this.categoryGroupId)
      props.push({
        columnDef: 'category',
        header: 'Category',
        property: null,
        cell: (element: GroupItem) => complect?.groups?.find(g => g.id === element.groupId)?.name ?? '',
        width: '30px',
        class: 'item__category'
      });
    else{
      props.unshift({
        columnDef: 'expand',
        header: '',
        property: null,
        cell: (element: GroupItem) => '',
        width: '20px',
        class: 'expand'
      });
      props.unshift({
        columnDef: 'move-item',
        header: '',
        property: null,
        cell: () => '',
        width: '30px',
        class: 'move'
      })
    }
       
    props.push({
      columnDef: 'count',
      header: 'Count',
      property: null,
      cell: (element: GroupItem) => `${element.count}`,
      width: '20px',
      class: 'value count'
    });
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

  //#region Items

  getComplectItemViews(groups: GroupDto [], items: Item [], properties: PropertyDto[],  groupPropertyId: string | null) {
    if(groups && items){
      if (groupPropertyId === this.categoryGroupId)
        return this.getItemsByGroups(groups, items, properties);
      else
        return this.getItemsByGrouppingField(groups, items, properties, groupPropertyId);
    }
    else
      return [];
  }

  getItemViews(items: Item[], groupItems: GroupItemDto []) : GroupItemView[] {
    return groupItems.map(gi => {
      return {
        groupItem: gi,
        item: items.find(i => i.id === gi.itemId)
      }
    })
    .filter(i => i.item)
    .map(i => {
      return Object.assign(new GroupItemView(), i.item, i.groupItem) as GroupItemView
    });
  }

  getItemsByGroups(groups: GroupDto[], items: Item[], properties: PropertyDto[]) : GroupItemView[]{
    const groupedKeys : {[key: string]: GroupItemView[]} = {};
    groups.forEach(group => {   
      const keyProp = new Property();
      keyProp.value = keyProp.id = group.name;
      keyProp.name = 'Category';
      groupedKeys[group.id ?? ''] = [{
        isGroupBy: true,
        groupValue: keyProp,
        groupId: group.id
      } as GroupItemView]
      .concat(this.getItemViews(items, group.items));
    });
    return this.fillGroupViews(groupedKeys, properties);
  }

  getItemsByGrouppingField(groups: GroupDto[], items: Item[], properties: PropertyDto[], groupPropertyId: string | null | undefined) : GroupItemView[]{
    let complectItems : GroupItemView[] = this.getItemViews(items, groups.map(g => g.items)?.flat() ?? []);

    if (groupPropertyId) 
      complectItems = this.groupItemsByProp(complectItems, properties, groupPropertyId)
    return complectItems;
  }

  groupItemsByProp(items: GroupItemView[], properties: PropertyDto[], propertyId: string) : GroupItemView[] {

    const groupedKeys = items.reduce((group: {[key: string]: GroupItemView[]}, item) => {
      const keyProp = item.values.find(i => i.id == propertyId);
      const key  = keyProp?.value ?? '';
      if (!group[key]) {
       group[key] = [{
          isGroupBy: true,
          groupValue: keyProp,
        } as GroupItemView];
      }
      
      group[key].push(item);
      return group;
    }, {});

    return this.fillGroupViews(groupedKeys, properties);
  }

  fillGroupViews(groupedKeys: {[key: string]: GroupItemView[]}, properties: PropertyDto[]) : GroupItemView[] {
    let result: GroupItemView[] = [];

    Object.keys(groupedKeys).forEach(key => {

      result = result.concat(groupedKeys[key]);
      const summArray: number[] = []
      properties.forEach(p => {
        summArray.push(0);
      })

      groupedKeys[key].forEach(item =>{
        if (!item.isGroupBy) {
          item.values.forEach((val, idx) => {
            if (val.valueType === ValueTypeEnum.Decimal || val.valueType === ValueTypeEnum.Number){
              summArray[idx] += +(val.value ?? '0') * item.count;
            }
          });
        }
      })
      result.push({
        isSummary: true,
        count: groupedKeys[key].splice(1).reduce((summ: number, item) =>{
          summ += item.count;
          return summ;
        }, 0),
        values: properties.map((p, idx) => {
          const prop = Object.assign(new Property(), p);
          if (prop.valueType === ValueTypeEnum.Decimal || prop.valueType === ValueTypeEnum.Number)
            prop.value = summArray[idx].toString();
          else
          prop.value = '';
          
          return prop;
        } )
      } as GroupItemView)
    });
     
    return result;
  }

  changeItemGroup(id: string, oldGroupId: string, newGroupId: string){
    if (oldGroupId === newGroupId)
      return;
    this.complect$.pipe(take(1)).subscribe(complect => {
      const oldGroup = complect?.groups.find(g => g.id == oldGroupId);
      const newGroup = complect?.groups.find(g => g.id == newGroupId);
      const item = oldGroup?.items?.find(i => i.itemId == id)
      if (!oldGroup || !newGroup || !item)
        return;
      
      const complectItemForDelete = {
        itemId: item.itemId,
        groupId: item.groupId,
        count: item.count} as GroupItemDto;
      const complectItemForAdd = {
          itemId: item.itemId,
          groupId: newGroup.id,
          count: item.count} as GroupItemDto;
      this.complectsService.deleteGroupItem(complectItemForDelete);
      this.complectsService.addGroupItemToGroup(complectItemForAdd,newGroup);
    });
  }

//#endregion

//#region conditions

  isGroup(index: number, item: GroupItemView): boolean{
    return item.isGroupBy;
  }

  isSummary(index: number, item: GroupItemView): boolean{
    return item.isSummary;
  }

  isItem(index: number, item: GroupItemView): boolean{
    return !item.isGroupBy && !item.isSummary;
  }

  getChartLabel() {
    return `${this.showChart ? 'Hide' : 'Show'} chart`
  }

//#endregion
 
//#region open dialogs

  openEditComplectDialog(): void {
    this.complect$.pipe(take(1)).subscribe(complect => {
      const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
        data: complect,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result)
          this.complectChange.emit(result);
      });
    })
    
  }

  openCloneComplectDialog(): void {
    this.complect$.pipe(take(1)).subscribe(complect => {
      if (complect) {
        const newItem = Object.assign({} as ComplectDto, complect);
        newItem.id = '';
        newItem.groups = complect.groups.map(g => {
          const group = Object.assign({} as GroupDto, g);
          group.id = uuidv4();
          group.items = g.items.map(i => {
            const item = Object.assign({} as GroupItemDto, i);
            item.groupId = group.id ?? '';
            return item;
          })
          return group;
        });
        const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
          data: newItem,
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.complectChange.emit(result);
          }
        });
      } 
    })
  }

  openEditItemDialog(item: Item) {
    this.dialog.open(ItemEditDialogComponent, {
      data: item,
    });
  }

  openCloneItemDialog(item: GroupItem) {
    const newItem = Object.assign(new Item(), item);
    newItem.id = '';

    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: newItem,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.complect$.pipe(take(1)).subscribe(complect => {
        if (result && complect){
          const group = complect.groups.find(g => g.id === item.groupId) ?? complect.groups[0];
          this.complectsService.addItemToGroup(result, group);
        };
      })    
    });
  }

  openEditItemCountDialog(item: GroupItem) {
    const dialogRef =this.dialog.open(EditCountComponent, {
      data: item.count,
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result && result > 0 && result !== item.count){
        this.complect$.pipe(take(1)).subscribe(complect => {
          if(complect) {
            const complectItem = complect?.groups
              .find(g => !!item.groupId && g.id === item.groupId)
              ?.items.find(i => i.itemId == item.id);
            if(complectItem){
              complectItem.count = result;
            }
            this.complectsService.updateGroupItem({
              itemId: item.id,
              groupId: item.groupId,
              count: result
            } as GroupItemDto); 
          }
        });
      }
    });
  }

  openDeleteItemDialog(item: GroupItem) {
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete item?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && !this.itemsService.deleteItem(item.id))
        this.toastr.error("Deletion failed")
    });
  }

  openDeleteComplectItemDialog(item: GroupItem) {
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete item from complect?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        const complectItem = {
          itemId: item.id,
          groupId: item.groupId,
          count: item.count} as GroupItemDto;
        this.complectsService.deleteGroupItem(complectItem);
      }  
    });
  }

  openAddGroupDialog() {
    this.complect$.pipe(take(1)).subscribe(complect => {
      if (complect) {
        const dialogRef = this.dialog.open(GroupEditDialogComponent, {
          data: {complectId: complect?.id, items: [] as GroupItemDto[]} as GroupDto,
        });
      }
    });
  }

  openEditGroupDialog(view: GroupItemView) {
    this.complect$.pipe(take(1)).subscribe(complect => {
      const group = complect?.groups?.find(g => g.id === view.groupId)
      if (group) {
          this.dialog.open(GroupEditDialogComponent, {data: group});
      }
    });
  }

  openDeleteGroupDialog(view: GroupItemView) {
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete group?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.complect$.pipe(take(1)).subscribe(complect => {
          const group = {id: view.groupId ,complectId: complect?.id} as GroupDto;
          this.complectsService.deleteGroup(group);
        })
      }  
    });
  }

//#endregion

}
