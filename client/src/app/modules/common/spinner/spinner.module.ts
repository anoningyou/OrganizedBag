import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatDesignModule } from '../mat-design/mat-design.module';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule
  ],
  exports: [
    SpinnerComponent
  ]
})
export class SpinnerModule {


 }
