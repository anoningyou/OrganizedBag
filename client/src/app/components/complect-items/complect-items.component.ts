import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
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



@Component({
  selector: 'app-complect-items',
  templateUrl: './complect-items.component.html',
  styleUrls: ['./complect-items.component.scss']
})
export class ComplectItemsComponent implements OnInit {
  private itemObjectsSource = new BehaviorSubject<Item[]>([]);
  itemObjects$ = this.itemObjectsSource.asObservable();
  categoryGroupId = 'category';

  @Input() complect: ComplectDto | null = null;
  @Input() items: Item[] | null = [];
  @Input() properties: PropertyDto [] | null = [];
  @Input() groupPropertyId: string | undefined | null = this.categoryGroupId;
  @Output() complectItemUpdated: EventEmitter<GroupItemDto> = new EventEmitter();
  @Output() currentComplectChanged: EventEmitter<ComplectDto | null> = new EventEmitter();

  constructor(public itemsService: ItemsService,
    public complectsService: ComplectsService,
    public dialog: MatDialog,
    public toastr: ToastrService) {
  }
  ngOnInit(): void {
  }

  get propertiesSorted () {
    return this.properties?.sort((a,b) => a.params.complectOrder > b.params.complectOrder ? 1 : -1) ?? []
  }

  get propertiesFiltered () {
    return this.propertiesSorted.filter(p => p.params.complectDisplay) ?? [];
  }

  get columns() {
    const props =  this.propertiesFiltered.map(p => {
      return {
        columnDef: p.id ?? '',
        header: p.name,
        property: p as Property | null,
        cell: (element: GroupItem) => `${element.values.find(v => v.id === p.id)?.value}`,
        width: `${p.params.complectWidth ?? 50} px`,
        class: 'item__value'
      }
    })?? [];
    props.push({
      columnDef: 'count',
      header: 'Count',
      property: null,
      cell: (element: GroupItem) => `${element.count}`,
      width: '20px',
      class: 'item__value'
    })
    props.push({
      columnDef: 'actions',
      header: 'Actions',
      property: null,
      cell: (element: GroupItem) => '',
      width: '30px',
      class: 'item__actions'
    })
    return props;
  } 
  get displayedColumns(){
    const columns = this.columns?.map(c => c.columnDef) ?? [];
    return columns;
  } 

  get complectItemViews() {
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
      groupedKeys[group.name] = [{
        isGroupBy: true,
        groupValue: keyProp,
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
      this.propertiesFiltered.forEach(p => {
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
        values: this.propertiesFiltered.map((p, idx) => {
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

  isGroup(index: number, item: GroupItemView): boolean{
    return item.isGroupBy;
  }

  isSummary(index: number, item: GroupItemView): boolean{
    return item.isSummary;
  }
 
  openEditComplectDialog(): void {
    const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
      data: this.complect,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.complect = result;
    });
  }

  openCloneComplectDialog(): void {
    if (this.complect) {
      const newItem = Object.assign({} as ComplectDto, this.complect);
      newItem.id = '';
      newItem.groups = this.complect.groups.map(g => {
        const group = Object.assign({} as GroupDto, g);
        group.items = g.items.map(i => Object.assign({} as GroupItemDto, i))
        return group;
      });
      const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
        data: newItem,
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result)
        {
          this.complect = result;
          this.currentComplectChanged.emit(result);
        }
          
      });
    } 
  }

  onTableHeaderSelected(param: PropertyParamDto){
    this.itemsService.updatePropertyParam(param);
  }

  dropHeader(event: CdkDragDrop<PropertyDto[]>) {
    const propertyParams = event.container.data?.map(p => p.params) ?? [];
    moveItemInArray(propertyParams, event.previousIndex, event.currentIndex);
    propertyParams.forEach((param, idx) => {
      param.complectOrder = idx;
    });
    this.itemsService.updatePropertyParams(propertyParams);
  }


  drop(event: CdkDragDrop<any>) {
    if (!event.previousContainer.data || ! this.complect)
      return;
    if (event.previousContainer === event.container) {
      //moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      this.complectsService.addItemToGroup(item, this.complect.groups[0]).subscribe({
        next: () =>{
          this.toastr.info('Saved!');
        },
        error: error => this.toastr.error(error.error)
      });
      
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex,
      // );
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
      } as GroupItemDto)   
    }
     
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

  openEditGroupDialog(item: GroupItemDto) {
    // const dialogRef = this.dialog.open(ItemEditDialogComponent, {
    //   data: item,
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   // if (result)
    //   //   item = result;
    // });
  }

}
