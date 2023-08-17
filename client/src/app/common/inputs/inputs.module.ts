import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { MatDesignModule } from '../mat-design/mat-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextComponent } from './input-text/input-text.component';

@NgModule({
  declarations: [
    InputComponent,
    InputTextComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    InputComponent,
    InputTextComponent
  ]
})
export class InputsModule { }
