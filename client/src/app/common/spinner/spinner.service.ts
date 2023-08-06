import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class SpinnerService {
  showSpinner = false;
  constructor() { }

  show() {
    this.showSpinner = true;
  }

  hide() {
    this.showSpinner = false;
  }
}
