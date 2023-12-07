import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { ItemValueModule } from '../item-value/item-value.module';



@NgModule({
  declarations: [
    ItemComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule,
    ItemValueModule
  ],
  exports: [
    ItemComponent
  ],
})
export class ItemModule { }
