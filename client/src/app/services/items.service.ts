import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';

import { PropertyDto } from '../models/property-dto';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { ItemDto } from '../models/item-dto';
import { ItemsHttpService } from './items-http.service';
import { PropertiesHttpService } from './properties-http.service';
import { ComplectsHttpService } from './complects-http.service';
import { ComplectDto } from '../models/complect-dto';
import { AccountService } from './account.service';
import { Item } from '../models/item';
import { Property } from '../models/property';
import { Guid } from 'guid-typescript';
import { PropertyValueDto } from '../models/property-value-dto';
import { ComplectItemDto } from '../models/complect-item-dto';
import { PropertyParamDto } from '../models/property-param-dto';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
    private itemsSource = new BehaviorSubject<ItemDto[]>([]);
    items$ = this.itemsSource.asObservable();

  private propertiesSource = new BehaviorSubject<PropertyDto[]>([]);
  properties$ = this.propertiesSource.asObservable();

  private complectsSource = new BehaviorSubject<ComplectDto[]>([]);
  complects$ = this.complectsSource.asObservable();

  private itemObjectsSource = new BehaviorSubject<Item[]>([]);
  itemObjects$ = this.itemObjectsSource.asObservable();

  private currentComplectSource = new BehaviorSubject<ComplectDto | null>(null);
  currrentComplect$ = this.currentComplectSource.asObservable();

  constructor(
    private itemsHttp: ItemsHttpService,
    private propertiesHttp: PropertiesHttpService,
    private complectsHttp: ComplectsHttpService,
    private accountService: AccountService
  ) {
    this.items$.subscribe((items) => {
      const properties: PropertyDto[] = this.propertiesSource.getValue() ?? [];
      this.setItemObjects(items ?? [], properties);
    });

    this.properties$.subscribe((properties) => {
      const items: ItemDto[] = this.itemsSource.getValue() ?? [];
      this.setItemObjects(items, properties ?? []);
    });
  }

  private setItemObjects(items: ItemDto[], properties: PropertyDto[]) {
    var itemObjects = items.map((i) => {
      const item = Object.assign(new Item(), i) as Item;
      item.values = properties.map((prop) => {
        const value = i.values.find((v) => v.propertyId === prop.id);
        const propertyValue = Object.assign(new Property(), prop) as Property;
        propertyValue.value = value?.value;
        return propertyValue;
      });
      return item;
    });
    this.itemObjectsSource.next(itemObjects);
  }

  loadProperties(): Observable<PropertyDto[]> {
    return this.propertiesHttp.getAll().pipe(
      map((response: PropertyDto[]) => {
        const properties = response ?? [];
        this.propertiesSource.next(properties);
        return properties;
      })
    );
  }

  loadItems(): Observable<ItemDto[]> {
    return this.itemsHttp.getAll().pipe(
      map((response: ItemDto[]) => {
        const items = response ?? [];
        this.itemsSource.next(items);
        return items;
      })
    );
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

  loadAll() {
    this.loadProperties().subscribe((_) => {
      if (this.accountService.currentUser$)
        this.loadItems().subscribe((_) => {
          this.loadComplects().subscribe((c) => {
            if (c && c.length > 0) {
              this.currentComplectSource.next(c[0]);
            }
          });
        });
    });
  }

  createNewItem(): Item {
    const item = new Item();
    item.values = (this.propertiesSource.getValue() ?? []).map((prop) => {
      return Object.assign(new Property(), prop) as Property;
    });
    return item;
  }

  saveItem(item: Item) {
    if (item.id === Guid.EMPTY) return this.addItem(item);
    else return this.updateItem(item);
  }

  addItem(item: Item) {
    const itemDto = {
      id: Guid.create().toString(),
      values: item.values.map((v) => {
        return { propertyId: v.id, value: v.value } as PropertyValueDto;
      }),
    } as ItemDto;
    return this.itemsHttp.add(itemDto).pipe(
      map((response: ItemDto) => {
        if (response) {
          this.items$.pipe(take(1)).subscribe((items) => {
            items.push(response);
            this.itemsSource.next(items);
          });
        }
      })
    );
  }

  updateItem(item: Item) {
    const itemDto = {
      id: item.id,
      values: item.values.map((v) => {
        return { propertyId: v.id, value: v.value } as PropertyValueDto;
      }),
    } as ItemDto;
    return this.itemsHttp.edit(itemDto).pipe(
      map((response: ItemDto) => {
        if (response) {
          this.items$.pipe(take(1)).subscribe((items) => {
            var idx = items.findIndex((v) => v.id === response.id);
            items[idx] = response;
            this.itemsSource.next(items);
          });
        }
      })
    );
  }

  deleteItem(itemId: string) {

    return this.itemsHttp.delete(itemId).pipe(
      map((response: boolean) => {
        if (response) {
          this.items$.pipe(take(1)).subscribe((items) => {
            const newItems = items.filter((v) => v.id !== itemId);
            this.itemsSource.next(newItems);
          });
        }
      })
    );
  }

  createNewComplect(): ComplectDto {
    return {
      id: Guid.EMPTY,
      name: '',
      description: '',
      items: [],
    } as ComplectDto;
  }

  saveComplect(complect: ComplectDto) {
    if (complect.id === Guid.EMPTY) return this.addComplect(complect);
    else return this.updateComplect(complect);
  }

  addComplect(complect: ComplectDto) {
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

  setCurrentComplect(complect: ComplectDto) {
    this.currentComplectSource.next(complect);
  }

  addItemToComplect(item: Item, complect: ComplectDto) {
    const dto = {
      itemId: item.id,
      complectId: complect.id,
      count: 1,
    } as ComplectItemDto;
    let existsCount = 0;
    if (!complect.items) complect.items = [];
    else {
      existsCount =
        complect.items.find((i) => i.itemId === item.id)?.count ?? 0;
      dto.count += existsCount;
    }

    complect.items.push(dto);
    this.currentComplectSource.next(this.currentComplectSource.getValue());
    if (existsCount) return this.complectsHttp.updateItem(dto);
    else return this.complectsHttp.addItem(dto);
  }

  updatePropertyParam(param: PropertyParamDto) {
    this.properties$.pipe(take(1)).subscribe(props => {
      const prop = props.find(p => p.id === param.propertyId);
      if (prop)
        prop.params = param;
      this.propertiesSource.next(props);
    })
  }
}
