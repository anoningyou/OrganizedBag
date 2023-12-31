import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { Property } from 'src/app/models/property';
import { ItemsService } from 'src/app/services/items.service';
import { YesNoComponent } from 'src/app/modules/common/dialog/yes-no/yes-no.component';
import { ToastrService } from 'ngx-toastr';
import { ItemEditDialogComponent } from 'src/app/modules/dialogs/item-edit-dialog/item-edit-dialog/item-edit-dialog.component';

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
    .sort((a, b) => ((a.params?.listOrder ?? 0) < (b.params?.listOrder ?? 0) ? -1 : 1));
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
  openCloneItemDialog() {
    const newItem = Object.assign(new Item(), this.item);
    newItem.id = '';

    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: newItem,
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
      if (result && !this.itemsService.deleteItem(this.item.id))
        this.toastr.error("Deletion failed")
    });
  }

}
