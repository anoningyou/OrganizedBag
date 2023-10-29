import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemValueComponent } from './item-value/item-value.component';



@NgModule({
  declarations: [
    ItemValueComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ItemValueComponent
  ],
})
export class ItemValueModule { }
