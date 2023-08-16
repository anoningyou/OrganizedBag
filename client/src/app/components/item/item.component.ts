import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { Property } from 'src/app/models/property';
import { ItemsService } from 'src/app/services/items.service';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';
import { YesNoComponent } from 'src/app/common/dialog/yes-no/yes-no.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent  {
  @Input() item: Item = new Item();
  
  constructor(public itemsService: ItemsService,
    public dialog: MatDialog,
    private toastr: ToastrService) {
  }
  
  get values(): Property[] {
    return this.item.values
    .filter((v) => v.params?.listDisplay)
    .sort((v) => v.params?.listOrder ?? 0);
  }
  getWidth(property: Property) {
    return `${property.params?.listWidth ?? 50}px`;
  }

  openEditItemDialog() {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: this.item,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.item = result;
    });
  }

  openDeleteItemDialog() {
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete item?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.itemsService.deleteItem(this.item.id).subscribe({
          next: () =>{
              this.toastr.info('Done!');
            },
          error: error => this.toastr.error(error.error)
        })
    });
  }

}
