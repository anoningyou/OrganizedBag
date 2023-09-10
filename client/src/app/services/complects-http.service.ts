import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ComplectDto } from '../models/dto/complect-dto';
import { GroupItemDto } from '../models/dto/group-item-dto';
import { GroupDto } from '../models/dto/group-dto';

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

  delete(model: string) {
    const params = new HttpParams()
        .set('id', model);
    return this.http.delete<boolean>(`${this.rootUrl}delete`, {params});
  }

  addGroup(model: GroupDto) {
    return this.http.post<GroupItemDto>(`${this.rootUrl}addGroup`, model);
  }

  deleteGroup(model: string) {
    const params = new HttpParams()
        .set('id', model);
    return this.http.delete<boolean>(`${this.rootUrl}deleteGroup`, {params});
  }

  updateGroup(model: GroupDto) {
    return this.http.put<GroupDto>(`${this.rootUrl}updateGroup`, model);
  }

  addItem(model: GroupItemDto) {
    return this.http.post<GroupItemDto>(`${this.rootUrl}addItem`, model);
  }

  deleteItem(model: GroupItemDto) {
    const params = new HttpParams()
        .set('itemId', model.itemId)
        .set('groupId', model.groupId);
    return this.http.delete<boolean>(`${this.rootUrl}deleteItem`, {params});
  }

  updateItem(model: GroupItemDto) {
    return this.http.put<GroupItemDto>(`${this.rootUrl}updateItem`, model);
  }
}