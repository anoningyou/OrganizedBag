import { Injectable, OnInit } from '@angular/core';
import PropertyDto from '../models/dto/property-dto';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { ItemDto } from '../models/dto/item-dto';
import { ItemsHttpService } from './items-http.service';
import { PropertiesHttpService } from './properties-http.service';
import { AccountService } from './account.service';
import { Item } from '../models/item';
import { Property } from '../models/property';
import { PropertyValueDto } from '../models/dto/property-value-dto';
import { PropertyParamDto } from '../models/dto/property-param-dto';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private itemsSource = new BehaviorSubject<ItemDto[]>([]);
  items$ = this.itemsSource.asObservable();

  private propertiesSource = new BehaviorSubject<PropertyDto[]>([]);
  properties$ = this.propertiesSource.asObservable();

  private itemObjectsSource = new BehaviorSubject<Item[]>([]);
  itemObjects$ = this.itemObjectsSource.asObservable();

  constructor(
    private itemsHttp: ItemsHttpService,
    private propertiesHttp: PropertiesHttpService,
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

  loadAll() {
    this.loadProperties().subscribe((_) => {
      this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
        if (user)
          this.loadItems().subscribe((_) => {
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
    if (!item.id) return this.addItem(item);
    else return this.updateItem(item);
  }

  addItem(item: Item) {
    const itemDto = {
      id: crypto.randomUUID(),
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
        return response;
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
        return response;
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

  updatePropertyParam(param: PropertyParamDto) {
    this.accountService.takeCurrentUser().subscribe((user) => {
      if (user) {
        this.propertiesHttp.updateParam(param).subscribe((response) => {
          this.resetPropertyParams([response]);
        });
      } else {
        this.resetPropertyParams([param]);
      }
    });
  }

  updatePropertyParams(params: PropertyParamDto[]) {
    this.accountService.takeCurrentUser().subscribe((user) => {
      if (user) {
        this.propertiesHttp.updateParams(params).subscribe((response) => {
          this.resetPropertyParams(response);
        });
      } else {
        this.resetPropertyParams(params);
      }
    });
  }

  resetPropertyParams(params: PropertyParamDto[]) {
    this.properties$.pipe(take(1)).subscribe((props) => {
      params.forEach((param) => {
        const prop = props.find((p) => p.id === param.propertyId);
        if (prop) prop.params = param;
      });
      this.propertiesSource.next(props);
    });
  }
}
