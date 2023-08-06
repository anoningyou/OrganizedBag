import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  model: any = {};
  hidePassword = true;
  
  constructor(public accountService: AccountService,
    private router: Router
     //private toastr: ToastrService
     ) { }

    logout(){
      this.accountService.logout();
      //this.router.navigateByUrl('/');
    }
}
