import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsComponent } from './items/items.component';
import { ItemEditDialogModule } from '../dialogs/item-edit-dialog/item-edit-dialog.module';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemValueModule } from '../item-value/item-value.module';
import { ItemViewModule } from '../item-view/item-view.module';
import { DialogModule } from 'src/app/modules/common/dialog/dialog.module';
import { LongPressModule } from 'src/app/modules/common/long-press/long-press.module';




@NgModule({
  declarations: [
    ItemsComponent
  ],
  imports: [
    CommonModule,
    ItemEditDialogModule,
    MatDesignModule,
    FormsModule,
    ReactiveFormsModule,
    ItemValueModule,
    ItemViewModule,
    DialogModule,
    LongPressModule
  ],
  exports: [
    ItemsComponent
  ]
})
export class ItemsModule { }
