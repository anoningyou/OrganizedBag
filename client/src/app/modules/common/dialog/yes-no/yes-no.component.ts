import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yes-no',
  templateUrl: './yes-no.component.html',
  styleUrls: ['./yes-no.component.scss']
})
export class YesNoComponent {
  public title: string = 'Are you sure?';
  constructor(
    public dialogRef: MatDialogRef<YesNoComponent>,
    @Inject(MAT_DIALOG_DATA) title: string | undefined | null
  ) {
    if (title){
      this.title = title;
    }
  }

  onOkClick() {
    this.dialogRef.close(true);
  }
  
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}
