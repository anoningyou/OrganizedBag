import { Component, HostListener, OnInit, inject } from '@angular/core';
import { AccountService } from './services/account.service';
import { ScreenStateStore } from './stores/screen.store';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Organised bag';
  private screenStateStore = inject(ScreenStateStore)

  constructor(private accountService: AccountService,
              private deviceService: DeviceDetectorService){}
  
  ngOnInit(): void {
    this.accountService.reLoadUser();
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: any) {
    this.screenStateStore.setIsPortrait(event.currentTarget.orientation === 0);
  }

}
