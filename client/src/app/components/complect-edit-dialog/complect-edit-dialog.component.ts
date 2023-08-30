import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { ComplectsService } from 'src/app/services/complects.service';

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
    private complectsService: ComplectsService,
    private toastr: ToastrService
  ) {
    if (data){
      this.data = Object.assign({} as ComplectDto,data);
    }
      else this.data = this.complectsService.createNewComplect();
      console.log(this.data)
  }

  getTitle(): string {
    if(!this.data.id)
      return 'Add complect';
    else
      return 'Edit complect';
  }

  onOkClick() {
    this.complectsService.saveComplect(this.data).subscribe({
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
