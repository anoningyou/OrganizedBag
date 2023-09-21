import { Injectable } from '@angular/core';
import PropertyDto from '../models/dto/property-dto';
import { BehaviorSubject, Observable, combineLatest, map, take } from 'rxjs';
import { ItemDto } from '../models/dto/item-dto';
import { ItemsHttpService } from './items-http.service';
import { PropertiesHttpService } from './properties-http.service';
import { AccountService } from './account.service';
import { Item } from '../models/item';
import { Property } from '../models/property';
import { PropertyValueDto } from '../models/dto/property-value-dto';
import { PropertyParamDto } from '../models/dto/property-param-dto';
import { BaseDataService } from './base-data.service';

@Injectable({
  providedIn: 'root',
})
export class ItemsService extends BaseDataService {
  
  private itemsSource = new BehaviorSubject<ItemDto[]>([]);
  items$ = this.itemsSource.asObservable();

  private propertiesSource = new BehaviorSubject<PropertyDto[]>([]);
  properties$ = this.propertiesSource.asObservable();

  itemObjects$ = combineLatest({properties: this.properties$, items: this.items$}).pipe(map(data => {
    return data.items.map((i) => {
      const item = Object.assign(new Item(), i) as Item;
      item.values = data.properties.map((prop) => {
        const value = i.values.find((v) => v.propertyId === prop.id);
        const propertyValue = Object.assign(new Property(), prop) as Property;
        propertyValue.value = value?.value;
        return propertyValue;
      });
      return item;
    });
  }))

  constructor(
    protected itemsHttp: ItemsHttpService,
    protected propertiesHttp: PropertiesHttpService,
    accountService: AccountService,
  ) {
    super(accountService);
    this.init();
  }

  override cleanData() {
    localStorage.removeItem('items');
    this.itemsSource.next([]);
  }

  override mergeData() {
    this.loadProperties().subscribe((_) => {
        this.loadItems().subscribe((ites) => {})
    });
    //TODO realise merge local data to server
  }

  override loadAll() {
    this.loadProperties().subscribe((_) => {
      if (!!this.userId)
        this.loadItems().subscribe((_) => {});
      else {
        const itemsStr = localStorage.getItem('items');
        if (itemsStr){
          const items = JSON.parse(itemsStr) as ItemDto [];
          this.itemsSource.next(items);
        }
      }

      this.items$.subscribe(items => {
        localStorage.setItem('items',JSON.stringify(items));
      })
    });
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

  createNewItem(): Item {
    const item = new Item();
    item.values = (this.propertiesSource.getValue() ?? []).map((prop) => {
      return Object.assign(new Property(), prop) as Property;
    });
    return item;
  }

  saveItem(item: Item) {
    if (!item.id)
     return this.addItem(item);
    else
     return this.updateItem(item);
  }

  addItem(item: Item) {
    const itemDto = {
      id: crypto.randomUUID(),
      values: item.values.map((v) => {
        return { propertyId: v.id, value: v.value } as PropertyValueDto;
      }),
    } as ItemDto;

    this.items$.pipe(take(1)).subscribe((items) => {
      items.push(itemDto);
      this.itemsSource.next(items);
    });

    this.execAuthorisedHttp(this.itemsHttp.add(itemDto));   

    return itemDto;
  }

  updateItem(item: Item) {
    const itemDto = {
      id: item.id,
      values: item.values.map((v) => {
        return { propertyId: v.id, value: v.value } as PropertyValueDto;
      }),
    } as ItemDto;

    this.items$.pipe(take(1)).subscribe((items) => {
      var idx = items.findIndex((v) => v.id === itemDto.id);
      items[idx] = itemDto;
      this.itemsSource.next(items);
    });

    this.execAuthorisedHttp(this.itemsHttp.edit(itemDto));   

    return itemDto;
  }

  deleteItem(itemId: string) {
    this.items$.pipe(take(1)).subscribe((items) => {
      const newItems = items.filter((v) => v.id !== itemId);
      this.itemsSource.next(newItems);
    });

    this.execAuthorisedHttp(this.itemsHttp.delete(itemId));   

    return true;
  }

  updatePropertyParam(param: PropertyParamDto) {
    this.resetPropertyParams([param]);
    this.execAuthorisedHttp(this.propertiesHttp.updateParam(param)); 
  }

  updatePropertyParams(params: PropertyParamDto[]) {
    this.resetPropertyParams(params);
    this.execAuthorisedHttp(this.propertiesHttp.updateParams(params)); 
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
