import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements ControlValueAccessor {
  @Input() label = ''
  @Input() type = 'text'

  hidePassword = true;

  constructor (@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
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
