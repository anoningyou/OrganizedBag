import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemsComponent } from './items/items.component';
import { ItemEditDialogModule } from '../dialogs/item-edit-dialog/item-edit-dialog.module';
import { MatDesignModule } from 'src/app/common/mat-design/mat-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ItemValueModule } from '../item-value/item-value.module';
import { ItemViewModule } from '../item-view/item-view.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { DialogModule } from 'src/app/common/dialog/dialog.module';
import { LongPressDirective } from 'src/app/common/long-press/long-press.directive';
import { LongPressModule } from 'src/app/common/long-press/long-press.module';
import { HammerModule } from "node_modules/@angular/platform-browser";



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
    BrowserModule,
    BrowserAnimationsModule,
    DialogModule,
    LongPressModule,
    HammerModule
  ],
  exports: [
    ItemsComponent
  ]
})
export class ItemsModule { }
