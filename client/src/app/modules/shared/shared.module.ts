import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponent } from './shared/shared.component';
import { SharedRoutingModule } from './shared-routing.module';
import { ComplectItemsModule } from '../complect-items/complect-items.module';
import { SharedService } from 'src/app/services/shared.service';
import { SharedHttpService } from 'src/app/services/shared-http.service';



@NgModule({
  declarations: [
    SharedComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    ComplectItemsModule
  ],
  exports: [
    SharedComponent
  ],
  providers: [
    SharedHttpService,
    SharedService
  ]
})
export class SharedModule { }
