import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplectItemsHeaderButtonsComponent } from './complect-items-header-buttons/complect-items-header-buttons.component';
import { MatDesignModule } from '../common/mat-design/mat-design.module';



@NgModule({
  declarations: [
    ComplectItemsHeaderButtonsComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule
  ],
  exports: [
    ComplectItemsHeaderButtonsComponent
  ],

})
export class ComplectItemsHeaderButtonsModule { }
