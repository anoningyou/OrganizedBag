import { Injectable } from '@angular/core';
import { SpinnerService } from '../common/spinner/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestsCount = 0;

  constructor(private spinnerService: SpinnerService) { }

  busy(){
    this.busyRequestsCount++;
    this.spinnerService.show()
  }

  idle(){
    this.busyRequestsCount--;
    if(this.busyRequestsCount<=0){
      this.busyRequestsCount=0;
      this.spinnerService.hide();
    }
  }
}
