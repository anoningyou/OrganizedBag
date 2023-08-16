import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { MatDesignModule } from '../mat-design/mat-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InputComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    InputComponent
  ]
})
export class InputsModule { }
