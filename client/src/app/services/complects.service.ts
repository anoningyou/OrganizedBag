import { Injectable } from '@angular/core';
import { ComplectDto } from '../models/dto/complect-dto';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { ComplectsHttpService } from './complects-http.service';
import { AccountService } from './account.service';
import { GroupDto } from '../models/dto/group-dto';
import { Item } from '../models/item';
import { GroupItemDto } from '../models/dto/group-item-dto';

@Injectable({
  providedIn: 'root',
})
export class ComplectsService {
  private complectsSource = new BehaviorSubject<ComplectDto[]>([]);
  complects$ = this.complectsSource.asObservable();

  constructor(
    private complectsHttp: ComplectsHttpService,
    private accountService: AccountService
  ) {}

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
    if (!complect.id) return this.addComplect(complect);
    else return this.updateComplect(complect);
  }

  addComplect(complect: ComplectDto) {
    complect.id = crypto.randomUUID();
    if (!complect.groups.length)
      complect.groups.push(this.createNewGroup(complect.id));
    else
      complect.groups.forEach((group) => {
        group.complectId = complect.id ?? '';
      });

    return this.complectsHttp.add(complect).pipe(
      map((response: ComplectDto) => {
        if (response) {
          this.complects$.pipe(take(1)).subscribe((complects) => {
            complects.push(response);
            this.complectsSource.next(complects);
          });
        }
      })
    );
  }

  updateComplect(complect: ComplectDto) {
    return this.complectsHttp.edit(complect).pipe(
      map((response: ComplectDto) => {
        if (response) {
          var values = this.complectsSource.getValue() ?? [];
          var idx = values.findIndex((v) => v.id === response.id);
          values[idx] = response;
          this.complectsSource.next(values);
        }
      })
    );
  }

  deleteComplect(id: string) {
    return this.complectsHttp.delete(id).pipe(
      map((response: boolean) => {
        if (response) {
          this.complects$.pipe(take(1)).subscribe((items) => {
            const newItems = items.filter((v) => v.id !== id);
            this.complectsSource.next(newItems);
          });
        }
      })
    );
  }

  saveGroup(dto: GroupDto) {
    if (!dto.id) return this.addGroup(dto);
    else return this.updateGroup(dto);
  }

  addGroup(dto: GroupDto) {
    dto.id = crypto.randomUUID();
    return this.complects$.pipe(take(1)).pipe(
      map((complects: ComplectDto[]) => {
        const complect = complects.find((c) => c.id == dto.complectId);
        if (complect) {
          complect.groups.push(dto);
          this.complectsSource.next(complects);
          this.complectsHttp.addGroup(dto).subscribe((result) => {});
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
          this.complectsHttp.updateGroup(dto).subscribe((result) => {});
          return dto;
        } else return null;
      })
    );
  }


  deleteGroup(dto: GroupDto) {
    return this.complects$.pipe(take(1)).pipe(
      map((complects: ComplectDto[]) => {
        const complect = complects.find((c) => c.id == dto.complectId);
        if (complect && dto.id) {
          complect.groups = complect.groups.filter(g => g.id !== dto.id);
          this.complectsSource.next(complects);
          this.complectsHttp.deleteGroup(dto.id).subscribe((result) => {});
          return true;
        } else return false;
      })
    );
  }

  addItemToGroup(item: Item, group: GroupDto) {
    const dto = {
      itemId: item.id,
      groupId: group.id,
      count: 1,
    } as GroupItemDto;
    let existsCount = 0;
    if (!group.items) group.items = [];
    else {
      const existItem = group.items.find((i) => i.itemId === item.id);
      if (existItem) {
        existsCount = existItem.count;
        existItem.count += dto.count;
        dto.count = existItem.count;
      }
    }
    if (!existsCount) group.items.push(dto);
    //this.currentComplectSource.next(this.currentComplectSource.getValue());
    if (existsCount) return this.complectsHttp.updateItem(dto);
    else return this.complectsHttp.addItem(dto);
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

      this.complectsHttp.updateItem(groupItem).subscribe((response) => {});
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

      this.complectsHttp.deleteItem(groupItem).subscribe((response) => {});
    });
  }
}
