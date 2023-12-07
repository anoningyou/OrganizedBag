import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ValueTypeEnum } from 'src/app/enums/value-type';

@Component({
  selector: 'app-edit-count',
  templateUrl: './edit-count.component.html',
  styleUrls: ['./edit-count.component.scss']
})
export class EditCountComponent implements OnInit {

  public data: number;
  form: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  valueTypeEnum:  typeof ValueTypeEnum = ValueTypeEnum;
  
  constructor(
    public dialogRef: MatDialogRef<EditCountComponent>,
    @Inject(MAT_DIALOG_DATA) data: number,
    private fb: FormBuilder
  ) {
      this.data = data;
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      count: new FormControl(this.data, [Validators.required, Validators.min(1)])
    });
  }

  onOkClick() {
    this.dialogRef.close(+this.form.value.count);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

}
