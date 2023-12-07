import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from 'src/app/modules/common/inputs/inputs.module';
import { RegisterRoutingModule } from './register-routing.module';



@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDesignModule,
    InputsModule,
    RegisterRoutingModule,
  ],
  exports: [
    RegisterComponent
  ],
})
export class RegisterModule { }
