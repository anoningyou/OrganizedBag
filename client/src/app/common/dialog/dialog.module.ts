import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { YesNoComponent } from './yes-no/yes-no.component';
import { MatDesignModule } from '../mat-design/mat-design.module';
import { EditCountComponent } from './edit-count/edit-count.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '../inputs/inputs.module';



@NgModule({
  declarations: [
    YesNoComponent,
    EditCountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDesignModule,
    InputsModule
  ],
  exports: [
    YesNoComponent
  ],
})
export class DialogModule { }
