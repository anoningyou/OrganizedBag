import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ItemDto } from '../models/dto/item-dto';

@Injectable({
  providedIn: 'root'
})
export class ItemsHttpService extends BaseHttpService {

  constructor(http: HttpClient) { 
    super(http,'items');
  }

  getAll() {
    return this.http.get<ItemDto[]>(`${this.rootUrl}getall`);
  }

  add(model: ItemDto) {
    return this.http.post<ItemDto>(`${this.rootUrl}add`, model);
  }

  addRange(model: ItemDto[]) {
    return this.http.post<ItemDto[]>(`${this.rootUrl}addRange`, model);
  }

  edit(model: ItemDto) {
    return this.http.put<ItemDto>(`${this.rootUrl}edit`, model);
  }

  delete(model: string) {
    const params = new HttpParams()
        .set('id', model);
    return this.http.delete<boolean>(`${this.rootUrl}delete`, {params});
  }
}
