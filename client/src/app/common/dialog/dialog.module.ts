import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YesNoComponent } from './yes-no/yes-no.component';
import { MatDesignModule } from '../mat-design/mat-design.module';



@NgModule({
  declarations: [
    YesNoComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule
  ],
  exports: [
    YesNoComponent
  ],
})
export class DialogModule { }
