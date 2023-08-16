import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/models/item';
import { Property } from 'src/app/models/property';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-item-edit-dialog',
  templateUrl: './item-edit-dialog.component.html',
  styleUrls: ['./item-edit-dialog.component.scss']
})
export class ItemEditDialogComponent {
  public data: Item;
  constructor(
    public dialogRef: MatDialogRef<ItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Item | undefined | null,
    private itemsService: ItemsService,
    private toastr: ToastrService
  ) {
    if (data){
      this.data = Object.assign(new Item(),data);
      this.data.values = data.values.map(v => Object.assign(new Property(),v));
    }
      else this.data = this.itemsService.createNewItem();
  }

  getTitle(): string {
    if(this.data.id === Guid.EMPTY)
      return 'Add item';
    else
      return 'Edit item';
  }

  onOkClick() {
    this.itemsService.saveItem(this.data).subscribe({
      next: () =>{
          this.toastr.info('Done!');
          this.dialogRef.close(this.data);
        },
      error: error => this.toastr.error(error.error)
    })
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
