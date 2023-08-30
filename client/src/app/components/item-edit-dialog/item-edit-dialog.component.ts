import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/models/item';
import { Property } from 'src/app/models/property';
import { ItemsService } from 'src/app/services/items.service';
import { ValueTypeEnum } from "../../enums/value-type";
import { ItemDto } from 'src/app/models/dto/item-dto';
@Component({
  selector: 'app-item-edit-dialog',
  templateUrl: './item-edit-dialog.component.html',
  styleUrls: ['./item-edit-dialog.component.scss']
})
export class ItemEditDialogComponent implements OnInit {
  public data: Item;
  form: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  
  constructor(
    public dialogRef: MatDialogRef<ItemEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: Item | undefined | null,
    private itemsService: ItemsService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    if (data){
      this.data = Object.assign(new Item(),data);
      this.data.values = data.values.map(v => Object.assign(new Property(),v));
    }
      else this.data = this.itemsService.createNewItem();
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    const group: any = {};
    this.data.values.forEach(val => {
      group[val.id] = new FormControl(val.value || '', this.getValidators(val));
    });

    this.form = this.fb.group(group);
  }

  getValidators(property: Property) {
    const validators = [];
    if (property.name === 'Name')
      validators.push(Validators.required);
    return validators;
  }



  getTitle(): string {
    if(!this.data.id)
      return 'Add item';
    else
      return 'Edit item';
  }

  onOkClick() {
    const values = this.form.value;
    this.data.values.forEach(v => {
      v.value = values[v.id]
    });
    this.itemsService.saveItem(this.data).subscribe({
      next: (response: ItemDto) =>{
          this.toastr.info('Done!');
          this.dialogRef.close(response);
        },
      error: error => this.toastr.error(error.error)
    })
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
