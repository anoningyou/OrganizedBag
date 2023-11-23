import { Component, Inject, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { ValueTypeEnum } from 'src/app/enums/value-type';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label = ''
  @Input() valueType = ValueTypeEnum.Unknown;
  @Input() type = 'text';
  @Input() step: number | undefined = undefined;
  @Input() min: number | Date | null = null;
  @Input() max: number | Date | null = null;

  hidePassword = true;
  valueTypeEnum: typeof ValueTypeEnum = ValueTypeEnum;

  constructor (@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  ngOnInit(): void {
    this.setControlType(this.valueType);
  }

  setControlType(valueTypeEnum: string) {
    switch (valueTypeEnum) {
      case ValueTypeEnum.Number:
        if (this.min === undefined || this.min === null || isNaN(+this.min))
          this.min = 0;
        if (this.step === undefined || this.step === null || isNaN(+this.step))
          this.step = 1;
        this.type = 'number';
        break;
      case ValueTypeEnum.Decimal:
        if (this.min === undefined || this.min === null || isNaN(+this.min))
          this.min = 0;
        if (this.step === undefined || this.step === null || isNaN(+this.step))
          this.step = 0.01;
        this.type = 'number';
        break;
      case ValueTypeEnum.Date:
        this.type = 'date';
        break;
      default:
        this.type = 'text';
        break;
    }
  }

  getDateFormatString(): string {
      return 'MM/DD/YYYY';
  }

  writeValue(obj: any): void {

  }

  registerOnChange(fn: any): void {

  }
  registerOnTouched(fn: any): void {

  }
  setDisabledState?(isDisabled: boolean): void {

  }

  get control(): FormControl {
    return this.ngControl.control as FormControl;
  }

  getErrorMessage() {
    if (this.ngControl.hasError('required')) {
      return `Please enter a ${this.label}`;
    }
    else if (this.ngControl.hasError('minlength')) {
      return `${this.label} must be at least ${this.ngControl.errors?.['minlength'].requiredLength} characters`;
    }
    else if (this.ngControl.hasError('maxlength')) {
      return `${this.label} must be at most ${this.ngControl.errors?.['maxlength'].requiredLength} characters`;
    }
    else if (this.ngControl.hasError('min')) {
      return `${this.label} must be at least ${this.ngControl.errors?.['min'].min}`;
    }
    else if (this.ngControl.hasError('max')) {
      return `${this.label} must be at most ${this.ngControl.errors?.['max'].max}`;
    }
    else if (this.ngControl.hasError('notMatching')) {
      return `${this.label} do not match`;
    }
    else if (this.ngControl.hasError('email')) {
      return 'Not a valid email';
    }
    else
      return '';
  }

}
