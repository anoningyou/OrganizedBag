import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupEditDialogComponent } from './group-edit-dialog/group-edit-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDesignModule } from '../common/mat-design/mat-design.module';




@NgModule({
  declarations: [
    GroupEditDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDesignModule
  ],
  exports: [
    GroupEditDialogComponent
  ],
})
export class GroupEditDialogModule { }
