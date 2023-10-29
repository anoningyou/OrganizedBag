import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemViewComponent } from './item-view/item-view.component';
import { MatDesignModule } from 'src/app/common/mat-design/mat-design.module';
import { ItemValueModule } from '../item-value/item-value.module';



@NgModule({
  declarations: [
    ItemViewComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule,
    ItemValueModule
  ],
  exports: [
    ItemViewComponent
  ],
})
export class ItemViewModule { }
