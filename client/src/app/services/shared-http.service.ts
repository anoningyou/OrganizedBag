import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { SharedComplectDto } from '../models/dto/shared-complect-dto';

@Injectable()
export class SharedHttpService extends BaseHttpService {

  constructor(http: HttpClient) { 
    super(http, 'shared');
  }

  getComplect(id: string) {
    const params = new HttpParams()
        .set('id', id);
    return this.http.get<SharedComplectDto>(`${this.rootUrl}getComplect`, {params});
  }
}
