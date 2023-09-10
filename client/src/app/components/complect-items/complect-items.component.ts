import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-complect-items',
  templateUrl: './complect-items.component.html',
  styleUrls: ['./complect-items.component.scss']
})
export class ComplectItemsComponent implements OnInit  {

//#region fields

  categoryGroupId = 'category';
  dataSource: MatTableDataSource<GroupItemView> = new MatTableDataSource();
  @ViewChild(MatTable) table?: MatTable<GroupItemView>;

//#endregion

//#region inputs
private x = 0;
  //#region complect
  private _complect: ComplectDto | null = null
  @Input() 
    set complect(complect: ComplectDto | null) {
      this._complect = complect;
      this.resetDataSource();
    }
    get complect() {
      return this._complect;
     }
  @Output() complectChange: EventEmitter<ComplectDto | null> = new EventEmitter();
  //#endregion

  //#region items
  private _items: Item[]  | null = [];
  @Input() 
    set items(items: Item[]  | null) {
      this._items = items;
      this.resetDataSource();
    }
    get items() { return this._items; }
  //#endregion

  //#region properties
  private _properties: PropertyDto [] | null = [];
  @Input() 
    set properties(properties: PropertyDto [] | null) {
      this._properties = properties;
      this.resetDataSource();
    }
    get properties() { return this._properties; }
  //#endregion

  //#region groupPropertyId
  private _groupPropertyId: string | undefined | null = this.categoryGroupId;
  @Input() 
    set groupPropertyId(groupPropertyId: string | undefined | null) {
      this._groupPropertyId = groupPropertyId;
      this.resetDataSource();
    }
    get groupPropertyId() { return this._groupPropertyId; }
  //#endregion

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
    this.dataSource.data = this.getComplectItemViews();
  }

  onGroupPropertyIdChanged() {
    this.resetDataSource();
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
    if (!this.complect)
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
      const group = this.complect.groups.find(g => g.id === newGroupElement.groupId) ?? this.complect.groups[0];
      this.complectsService.addItemToGroup(item, group).subscribe({
        next: () =>{
          this.resetDataSource();
          this.toastr.info('Saved!');
        },
        error: error => this.toastr.error(error.error)
      });
    }
  }

  onCountChange(event: any, item: GroupItem){
    item.count = +event.srcElement.value ?? 1;
    if (item.count < 1)
      item.count = 1;
    if(this.complect) {
      const complectItem = this.complect?.groups
        .find(g => !!item.groupId && g.id === item.groupId)
        ?.items.find(i => i.itemId == item.id);
      if(complectItem){
        complectItem.count = item.count;
      }
      this.complectItemUpdated.emit({
        itemId: item.id,
        groupId: item.groupId,
        count: item.count
      } as GroupItemDto);
      this.resetDataSource();  
    }
     
  }

//#endregion

//#region properties

  getPropertiesSorted () {
    return this.properties?.sort((a,b) => a.params.complectOrder > b.params.complectOrder ? 1 : -1) ?? []
  }

  getPropertiesFiltered () {
    return this.getPropertiesSorted().filter(p => p.params.complectDisplay) ?? [];
  }

  getColumns() {
    const props =  this.getPropertiesFiltered().map(p => {
      return {
        columnDef: p.id ?? '',
        header: p.name,
        property: p as Property | null,
        cell: (element: GroupItem) => `${element.values.find(v => v.id === p.id)?.value}`,
        width: `${p.params.complectWidth ?? 50} px`,
        class: 'item__value'
      }
    })?? [];
    
    if (this._groupPropertyId !== this.categoryGroupId)
      props.push({
        columnDef: 'category',
        header: 'Category',
        property: null,
        cell: (element: GroupItem) => this._complect?.groups?.find(g => g.id === element.groupId)?.name ?? '',
        width: '30px',
        class: 'item__category'
      });
    props.push({
      columnDef: 'count',
      header: 'Count',
      property: null,
      cell: (element: GroupItem) => `${element.count}`,
      width: '20px',
      class: 'item__value item__count'
    });
    props.push({
      columnDef: 'actions',
      header: 'Actions',
      property: null,
      cell: (element: GroupItem) => '',
      width: '30px',
      class: 'item__actions'
    });
    
    return props;
  }

  getDisplayedColumns(){
    const columns = this.getColumns()?.map(c => c.columnDef) ?? [];
    return columns;
  } 

  //#endregion
  
//#region items

  resetDataSource(){
    this.dataSource.data = this.getComplectItemViews();
    this.table?.renderRows();
  }

  getComplectItemViews() {
      if(this.complect?.groups && this.items){
        if (this.groupPropertyId === this.categoryGroupId)
          return this.getItemsByGroups(this.complect.groups, this.items);
        else
          return this.getItemsByGrouppingField(this.complect.groups, this.items, this.groupPropertyId);
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

  getItemsByGroups(groups: GroupDto[], items: Item[]) : GroupItemView[]{
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
      .concat(this.getItemViews(this.items ?? [], group.items));
    });
    return this.fillGroupViews(groupedKeys);
  }

  getItemsByGrouppingField(groups: GroupDto[], items: Item[], groupPropertyId: string | null | undefined) : GroupItemView[]{
    let complectItems : GroupItemView[] = this.getItemViews(items, groups.map(g => g.items)?.flat() ?? []);

    if (groupPropertyId) 
      complectItems = this.groupItemsByProp(complectItems, groupPropertyId)
    return complectItems;
  }

  groupItemsByProp(items: GroupItemView[], propertyId: string) : GroupItemView[] {

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

    return this.fillGroupViews(groupedKeys);
  }

  fillGroupViews(groupedKeys: {[key: string]: GroupItemView[]}) : GroupItemView[] {
    let result: GroupItemView[] = [];

    Object.keys(groupedKeys).forEach(key => {

      result = result.concat(groupedKeys[key]);
      const summArray: number[] = []
      this.getPropertiesFiltered().forEach(p => {
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
        values: this.getPropertiesFiltered().map((p, idx) => {
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
    const oldGroup = this._complect?.groups.find(g => g.id == oldGroupId);
    const newGroup = this._complect?.groups.find(g => g.id == newGroupId);
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
    this.resetDataSource();
    this.complectsService.addGroupItemToGroup(complectItemForAdd,newGroup)
      .subscribe(_ => this.resetDataSource());
  }

  //#endregion

//#region conditions

  isGroup(index: number, item: GroupItemView): boolean{
    return item.isGroupBy;
  }

  isSummary(index: number, item: GroupItemView): boolean{
    return item.isSummary;
  }

//#endregion
 
//#region open dialogs

  openEditComplectDialog(): void {
    const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
      data: this.complect,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.complect = result;
        this.complectChange.emit(result);
    });
  }

  openCloneComplectDialog(): void {
    if (this.complect) {
      const newItem = Object.assign({} as ComplectDto, this.complect);
      newItem.id = '';
      newItem.groups = this.complect.groups.map(g => {
        const group = Object.assign({} as GroupDto, g);
        group.id = crypto.randomUUID();
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
        if (result)
        {
          this.complect = result;
          this.complectChange.emit(result);
        }
          
      });
    } 
  }

  openEditItemDialog(item: Item) {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: item,
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result)
      //   item = result;
    });
  }

  openCloneItemDialog(item: GroupItem) {
    const newItem = Object.assign(new Item(), item);
    newItem.id = '';

    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: newItem,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.complect){

        this.complectsService.addItemToGroup(result, this.complect.groups[0]).subscribe({
          next: () =>{
          },
          error: error => this.toastr.error(error.error)
        });
      };
    });
  }

  openDeleteItemDialog(item: GroupItem) {
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete item?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.itemsService.deleteItem(item.id).subscribe({
          next: () =>{
              this.toastr.info('Done!');
            },
          error: error => this.toastr.error(error.error)
        })
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
    if (this.complect) {
      const dialogRef = this.dialog.open(GroupEditDialogComponent, {
        data: {complectId: this.complect?.id, items: [] as GroupItemDto[]} as GroupDto,
      });
    }
  }

  openEditGroupDialog(view: GroupItemView) {
    const group = this.complect?.groups?.find(g => g.id === view.groupId)
    if (group) {
      
      const dialogRef = this.dialog.open(GroupEditDialogComponent, {
        data: group,
      });
    }
  }

  openDeleteGroupDialog(view: GroupItemView) {
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete group?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        console.log(view)
        const group = {id: view.groupId ,complectId: this.complect?.id} as GroupDto;
        this.complectsService.deleteGroup(group);
      }  
    });
  }

//#endregion

}
