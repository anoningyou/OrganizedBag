import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { PropertyDto } from '../models/property-dto';

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
}
