import { NgModule } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';
import { MatDesignModule } from '../mat-design/mat-design.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatDesignModule
  ],
  exports: [
    SpinnerComponent
  ]
})
export class SpinnerModule {


 }
