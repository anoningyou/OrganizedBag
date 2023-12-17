import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { NavigationService } from 'src/app/services/navigation-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() cancelLogin = new EventEmitter();

  loginForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  
  constructor(public accountService: AccountService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private navigationService: NavigationService
     ){}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.fb.group({
      userName: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
    });
  }

  login(){
    const values = this.loginForm.value;
    this.accountService.login(values).subscribe({
      next: () =>{
          this.navigationService.back();
          //this.router. navigateByUrl('/');
        },
      error: error => this.toastr.error(error.error)
    })
  }
  
  cancel(){
    this.cancelLogin.emit(false);
    this.navigationService.back();
    //this.router.navigateByUrl('/');
  }
}
