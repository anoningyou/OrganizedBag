import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GroupDto } from 'src/app/models/dto/group-dto';
import { ComplectsService } from 'src/app/services/complects.service';

@Component({
  selector: 'app-group-edit-dialog',
  templateUrl: './group-edit-dialog.component.html',
  styleUrls: ['./group-edit-dialog.component.scss']
})
export class GroupEditDialogComponent {
  public data: GroupDto;
  constructor(
    public dialogRef: MatDialogRef<GroupEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: GroupDto,
    private complectsService: ComplectsService,
    private toastr: ToastrService
  ) {
      this.data = Object.assign({} as GroupDto,data);
  }

  getTitle(): string {
    if(!this.data.id)
      return 'Add group';
    else
      return 'Edit group';
  }

  onOkClick() {
    this.complectsService.saveGroup(this.data).subscribe({
      next: (result) =>{
        if(result){
          this.toastr.success('Done!');
          this.dialogRef.close(result);
        } else this.toastr.error('Error with saving group!')
          
        },
      error: error => this.toastr.error(error.error)
    })
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
