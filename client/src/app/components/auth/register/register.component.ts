import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();

  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;

  constructor(public accountService: AccountService,
    private router: Router,
    private fb: FormBuilder
     ){}
  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      userName: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(12)]],
      confirmPassword: ['',[Validators.required, this.matchValues('password')]]
    });

    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    });
  }

  matchValues(matchTo: string) : ValidatorFn {
    return(control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {notMatching: true}
    }
  }

  register(){
    const values = this.registerForm.value;
    this.accountService.register(values).subscribe({
      next: () =>{
          this.router.navigateByUrl('/');
        },
      error: response => {
        console.log(response.error)
        this.validationErrors = response.error
      }  
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
    this.router.navigateByUrl('/');
  }
}
