import { Injectable } from '@angular/core';
import { ComplectDto } from '../models/dto/complect-dto';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { ComplectsHttpService } from './complects-http.service';
import { AccountService } from './account.service';
import { GroupDto } from '../models/dto/group-dto';
import { Item } from '../models/item';
import { GroupItemDto } from '../models/dto/group-item-dto';
import { BaseDataService } from './base-data.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class ComplectsService extends BaseDataService {
  private complectsSource = new BehaviorSubject<ComplectDto[]>([]);
  complects$ = this.complectsSource.asObservable();

  constructor(accountService: AccountService,
    protected complectsHttp: ComplectsHttpService
  ) {
    super(accountService);
    this.init();
  }

  override cleanData() {
    localStorage.removeItem('complects');
    this.complectsSource.next([]);
  }

  override mergeData() {
      this.loadComplects().subscribe(_ => {});
    //TODO realise merge local data to server
  }

  override loadAll() {
    if (!!this.userId){
      this.loadComplects().subscribe(_ => {});
    }
    else {
      const complectsStr = localStorage.getItem('complects');
      if (complectsStr){
        const complects = JSON.parse(complectsStr) as ComplectDto [];
        this.complectsSource.next(complects);
       }
    }

    this.complects$.subscribe(complects => {
      localStorage.setItem('complects',JSON.stringify(complects));
    })
  }

  loadComplects(): Observable<ComplectDto[]> {
    return this.complectsHttp.getAll().pipe(
      map((response: ComplectDto[]) => {
        const complects = response ?? [];
        this.complectsSource.next(complects);
        return complects;
      })
    );
  }

  createNewComplect(): ComplectDto {
    return {
      id: null as string | null,
      name: '',
      description: '',
      groups: [this.createNewGroup()],
    } as ComplectDto;
  }

  createNewGroup(complectId: string | null = null): GroupDto {
    return {
      id: undefined as string | undefined,
      name: 'Default group',
      complectId: null as string | null,
      items: [],
    } as GroupDto;
  }

  saveComplect(complect: ComplectDto) {
    if (!complect.id)
     this.addComplect(complect);
    else 
      this.updateComplect(complect);
  }

  addComplect(complect: ComplectDto) {
    this.complects$.pipe(take(1)).subscribe((complects) => {
      complect.id = uuidv4();
      if (!complect.groups.length)
        complect.groups.push(this.createNewGroup(complect.id));
      else
        complect.groups.forEach((group) => {
          group.complectId = complect.id ?? '';
        });
      complects.push(complect);
      this.complectsSource.next(complects);
      this.execAuthorisedHttp(this.complectsHttp.add(complect));
    });
  }

  updateComplect(complect: ComplectDto) {
    this.complects$.pipe(take(1)).subscribe(complects => {
      var idx = complects.findIndex((v) => v.id === complect.id);
      complects[idx] = complect;
      this.complectsSource.next(complects);
      this.execAuthorisedHttp(this.complectsHttp.edit(complect))
    })
  }

  deleteComplect(id: string) {
    this.complects$.pipe(take(1)).subscribe((items) => {
      const newItems = items.filter((v) => v.id !== id);
      this.complectsSource.next(newItems);
    });
    this.execAuthorisedHttp(this.complectsHttp.delete(id));
    return true;
  }

  saveGroup(dto: GroupDto) {
    if (!dto.id) return this.addGroup(dto);
    else return this.updateGroup(dto);
  }

  addGroup(dto: GroupDto) {
    dto.id = uuidv4();
    return this.complects$.pipe(take(1)).pipe(
      map((complects: ComplectDto[]) => {
        const complect = complects.find((c) => c.id == dto.complectId);
        if (complect) {
          complect.groups.push(dto);
          this.complectsSource.next(complects);
          this.execAuthorisedHttp(this.complectsHttp.addGroup(dto));
          return dto;
        } else return null;
      })
    );
  }

  updateGroup(dto: GroupDto) {
    return this.complects$.pipe(take(1)).pipe(
      map((complects: ComplectDto[]) => {
        const complect = complects.find((c) => c.id == dto.complectId);
        const idx = complect?.groups?.findIndex(g => g.id === dto.id) ?? -1;
        if (complect && idx != -1) {
          complect.groups[idx].name = dto.name;
          this.complectsSource.next(complects);
          this.execAuthorisedHttp(this.complectsHttp.updateGroup(dto));
          return dto;
        } else return null;
      })
    );
  }


  deleteGroup(dto: GroupDto) {
    return this.complects$.pipe(take(1)).subscribe(complects => {
      const complect = complects.find((c) => c.id == dto.complectId);
      if (complect && dto.id) {
          complect.groups = complect.groups.filter(g => g.id !== dto.id);
          this.complectsSource.next(complects);
          this.execAuthorisedHttp(this.complectsHttp.deleteGroup(dto.id));
      }
    });
  }

  addGroupItemToGroup(item: GroupItemDto, group: GroupDto) {
    this.complects$.pipe(take(1)).subscribe(complects => {
      const complect = complects.find(c => c.id === group.complectId);
      const complectGroup = complect?.groups?.find(g => g.id === group.id)
      if (!complectGroup)
        return;
      const dto = Object.assign({}, item) as GroupItemDto;
      dto.groupId = complectGroup.id ?? '';
      let existsCount = 0;
      if (!complectGroup.items) 
        complectGroup.items = [];
      else {
        const existItem = complectGroup.items.find((i) => i.itemId === item.itemId);
        if (existItem) {
          existsCount = existItem.count;
          existItem.count += dto.count;
          dto.count = existItem.count;
        }
      }

      if (!existsCount) 
        complectGroup.items.push(dto);

      this.complectsSource.next(complects);

      if (existsCount) 
      this.execAuthorisedHttp(this.complectsHttp.updateItem(dto));
      else this.execAuthorisedHttp(this.complectsHttp.addItem(dto));
    })
    
  }

  addItemToGroup(item: Item, group: GroupDto) {
    const dto = {
      itemId: item.id,
      groupId: group.id,
      count: 1,
    } as GroupItemDto;
    return this.addGroupItemToGroup(dto, group);
  }

  updateGroupItem(groupItem: GroupItemDto) {
    this.complects$.pipe(take(1)).subscribe((complects) => {
      let groupIdx: number = -1;
      const complect = complects.find((c) => {
        groupIdx = c.groups.findIndex((g) => g.id === groupItem.groupId);
        return groupIdx > -1;
      });

      if (complect) {
        const idx =
          complect.groups[groupIdx].items.findIndex(
            (i) => i.itemId === groupItem.itemId
          ) ?? -1;
        if (idx !== -1) complect.groups[groupIdx].items[idx] = groupItem;
      }
      this.complectsSource.next(complects);
      this.execAuthorisedHttp(this.complectsHttp.updateItem(groupItem));
    });
  }

  deleteGroupItem(groupItem: GroupItemDto) {
    this.complects$.pipe(take(1)).subscribe((complects) => {
      let groupIdx: number = -1;
      const complect = complects.find((c) => {
        groupIdx = c.groups.findIndex((g) => g.id === groupItem.groupId);
        return groupIdx > -1;
      });

      if (complect) {
        const group = complect.groups[groupIdx];
        const idx =
          group.items.findIndex((i) => i.itemId === groupItem.itemId) ?? -1;
        if (idx !== -1) group.items.splice(idx, 1);
      }

      this.complectsSource.next(complects);
      this.execAuthorisedHttp(this.complectsHttp.deleteItem(groupItem));
    });
  }
}
