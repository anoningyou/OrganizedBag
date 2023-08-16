import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ComplectDto } from '../models/complect-dto';
import { ComplectItemDto } from '../models/complect-item-dto';

@Injectable({
  providedIn: 'root'
})
export class ComplectsHttpService extends BaseHttpService {

  constructor(http: HttpClient) { 
    super(http, 'complects');
  }

  getAll() {
    return this.http.get<ComplectDto[]>(`${this.rootUrl}getall`);
  }
  
  add(model: ComplectDto) {
    return this.http.post<ComplectDto>(`${this.rootUrl}add`, model);
  }

  edit(model: ComplectDto) {
    return this.http.put<ComplectDto>(`${this.rootUrl}edit`, model);
  }

  addItem(model: ComplectItemDto) {
    return this.http.post<ComplectItemDto>(`${this.rootUrl}addItem`, model);
  }

  deleteItem(model: ComplectItemDto) {
    const params = new HttpParams()
        .set('itemId', model.itemId.toString())
        .set('complectId', model.complectId.toString());
    return this.http.delete<boolean>(`${this.rootUrl}deleteItem`, {params});
  }

  updateItem(model: ComplectItemDto) {
    return this.http.put<ComplectItemDto>(`${this.rootUrl}updateItem`, model);
  }
}