import { Injectable } from '@angular/core';
import { SharedHttpService } from './shared-http.service';
import { BehaviorSubject, map, take } from 'rxjs';
import { SharedComplectDto } from '../models/dto/shared-complect-dto';
import { PropertyParamDto } from '../models/dto/property-param-dto';


@Injectable()
export class SharedService {

  private complectSource = new BehaviorSubject<SharedComplectDto | null>(null);
  complect$ = this.complectSource.asObservable();

  constructor(protected sharedHttpService: SharedHttpService) { }

  loadComplect(id: string) {
    return this.sharedHttpService.getComplect(id).pipe(map(c => {
      this.complectSource.next(c);
      return c;
    }))
  }

  clearComplect() {
    this.complectSource.next(null);
  }

  updatePropertyParam(param: PropertyParamDto) {
    this.resetPropertyParams([param]);
  }
  
  updatePropertyParams(params: PropertyParamDto[]) {
    this.resetPropertyParams(params);
  }

  resetPropertyParams(params: PropertyParamDto[]) {
    this.complect$.pipe(take(1)).subscribe((complect) => {
      params.forEach((param) => {
        const prop = complect?.properties.find((p) => p.id === param.propertyId);
        if (prop) 
          prop.params = param;
      });
      this.complectSource.next(complect);
    });
  }
}
