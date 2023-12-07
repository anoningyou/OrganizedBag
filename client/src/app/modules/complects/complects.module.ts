import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplectsComponent } from './complects/complects.component';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { ComplectEditDialogModule } from '../complect-edit-dialog/complect-edit-dialog.module';



@NgModule({
  declarations: [
    ComplectsComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule,
    ComplectEditDialogModule
  ],
  exports: [
    ComplectsComponent
  ],
})
export class ComplectsModule { }
