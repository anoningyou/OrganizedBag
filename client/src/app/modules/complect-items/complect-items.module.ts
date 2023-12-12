import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplectItemsComponent } from './complect-items/complect-items.component';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { LongPressModule } from 'src/app/modules/common/long-press/long-press.module';
import { ItemViewModule } from '../item-view/item-view.module';
import { ItemValueModule } from '../item-value/item-value.module';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/modules/common/chart/chart.module';
import { GroupEditDialogModule } from '../dialogs/group-edit-dialog/group-edit-dialog.module';




@NgModule({
  declarations: [
    ComplectItemsComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule,
    LongPressModule,
    ItemViewModule,
    ItemValueModule,
    FormsModule,
    ChartModule,
    GroupEditDialogModule
  ],
  exports: [
    ComplectItemsComponent
  ],
})
export class ComplectItemsModule { }
