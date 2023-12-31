import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/app/models/item';
import { Property } from 'src/app/models/property';
import { ItemsService } from 'src/app/services/items.service';

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
    private fb: FormBuilder
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
    const item = this.itemsService.saveItem(this.data)
    this.dialogRef.close(item);
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
}
