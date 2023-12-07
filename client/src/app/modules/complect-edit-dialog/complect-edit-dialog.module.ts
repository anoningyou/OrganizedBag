import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplectEditDialogComponent } from './complect-edit-dialog/complect-edit-dialog.component';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ComplectEditDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDesignModule,
  ],
  exports: [
    ComplectEditDialogComponent
  ],
})
export class ComplectEditDialogModule { }
