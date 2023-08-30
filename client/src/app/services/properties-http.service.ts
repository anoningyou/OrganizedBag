import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import PropertyDto from '../models/dto/property-dto';
import { PropertyParamDto } from '../models/dto/property-param-dto';

@Injectable({
  providedIn: 'root'
})
export class PropertiesHttpService extends BaseHttpService {

  constructor(http: HttpClient) { 
    super(http, 'properties');
  }

  getAll() {
    return this.http.get<PropertyDto[]>(`${this.rootUrl}getall`);
  }

  updateParam(model: PropertyParamDto) {
    return this.http.put<PropertyParamDto>(`${this.rootUrl}updateParam`, model);
  }

  updateParams(model: PropertyParamDto[]) {
    return this.http.put<PropertyParamDto[]>(`${this.rootUrl}updateParams`, model);
  }
}
