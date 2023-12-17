import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, map } from 'rxjs';
import { ItemsManager } from 'src/app/managers/items-manager';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { GroupDto } from 'src/app/models/dto/group-dto';
import PropertyDto from 'src/app/models/dto/property-dto';
import { PropertyParamDto } from 'src/app/models/dto/property-param-dto';
import { Item } from 'src/app/models/item';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.scss']
})
export class SharedComponent implements OnInit, OnDestroy {

  isMobile = false;
  private subscriptions: Subscription[] = [];

  complect$: Observable<ComplectDto | null>;
  items$: Observable<Item[] | null>;
  properties$: Observable<PropertyDto [] | null>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private sharedService: SharedService ) {
      this.complect$ = this.sharedService.complect$.pipe(map(c => c?.complect ?? null));

      this.properties$ = this.sharedService.complect$.pipe(map(c => c?.properties ?? null));

      this.items$ = this.sharedService.complect$.pipe(map(c => {
        if (c?.items && c.properties)
          return c.items.map((i) => {
            return ItemsManager.getItem(i,c.properties);
          });
        else
        return null;
      }));
    }

  ngOnInit(): void {
    const subscription = this.activatedRoute.paramMap.subscribe((data: ParamMap) => {
        const id = data.get('id');
        if (!!id) {
          this.subscriptions.push(this.sharedService.loadComplect(id).subscribe(_ => {})) 
        }
        else {
          this.toastr.error("Id is undefined");
          this.sharedService.clearComplect();
        }
      }
    );

    this.subscriptions.push(subscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (!!subscription){
        subscription.unsubscribe();
      }
      
    });
  }

  onCurrentCategoryChange(event: GroupDto | null){
    
  }

  onPropertyParamChange(propertyParam: PropertyParamDto) {
    this.sharedService.updatePropertyParam(propertyParam);
  }

  onPropertyParamsChange(propertyParams: PropertyParamDto[]) {
    this.sharedService.updatePropertyParams(propertyParams);
  }
}
