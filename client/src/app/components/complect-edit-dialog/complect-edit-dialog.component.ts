import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { ComplectDto } from 'src/app/models/complect-dto';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-complect-edit-dialog',
  templateUrl: './complect-edit-dialog.component.html',
  styleUrls: ['./complect-edit-dialog.component.scss']
})
export class ComplectEditDialogComponent {
  public data: ComplectDto;
  constructor(
    public dialogRef: MatDialogRef<ComplectEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ComplectDto | undefined | null,
    private itemsService: ItemsService,
    private toastr: ToastrService
  ) {
    if (data){
      this.data = data;
    }
      else this.data = this.itemsService.createNewComplect();
  }

  getTitle(): string {
    if(this.data.id === Guid.EMPTY)
      return 'Add complect';
    else
      return 'Edit complect';
  }

  onOkClick() {
    this.itemsService.saveComplect(this.data).subscribe({
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
