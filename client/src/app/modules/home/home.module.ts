import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ResizableModule } from 'angular-resizable-element';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { ItemsModule } from '../items/items.module';
import { ComplectItemsModule } from '../complect-items/complect-items.module';
import { ComplectsModule } from '../complects/complects.module';
import { HomeRoutingModule } from './home-routing.module';
import { ItemsService } from 'src/app/services/items.service';
import { ImportService } from 'src/app/services/import.service';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
     ResizableModule,
     MatDesignModule,
     ItemsModule,
     ComplectItemsModule,
     ComplectsModule, 
    HomeRoutingModule
  ],
  exports: [
    HomeComponent
  ],
  providers: [
    ItemsService,
    ImportService
  ]
})
export class HomeModule { }
