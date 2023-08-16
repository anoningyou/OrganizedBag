import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { ComplectEditDialogComponent } from '../complect-edit-dialog/complect-edit-dialog.component';
import { ComplectDto } from 'src/app/models/complect-dto';



@Component({
  selector: 'app-complects',
  templateUrl: './complects.component.html',
  styleUrls: ['./complects.component.scss']
})
export class ComplectsComponent {
  displayedColumns: string[] = ['name', 'description'];
  constructor(public itemsService: ItemsService,
    public dialog: MatDialog) {
  }

  openAddComplectDialog(): void {
    const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onComplectClick(complect: ComplectDto) {
    this.itemsService.setCurrentComplect(complect);
  }

}
