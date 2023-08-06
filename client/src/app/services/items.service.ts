import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  baseUrl = environment.apiUrl;
  constructor(
    private http: HttpClient
    ) {    
  }

  getProperties() {
    return this.http.get<Property[]>(`${this.baseUrl}properties/getall`)
  }
}
