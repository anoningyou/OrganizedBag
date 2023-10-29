import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemEditDialogComponent } from './item-edit-dialog/item-edit-dialog.component';
import { InputsModule } from 'src/app/common/inputs/inputs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDesignModule } from 'src/app/common/mat-design/mat-design.module';



@NgModule({
  declarations: [
    ItemEditDialogComponent
  ],
  imports: [
    CommonModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    MatDesignModule
  ],
  exports: [
    ItemEditDialogComponent
  ],
})
export class ItemEditDialogModule { }
