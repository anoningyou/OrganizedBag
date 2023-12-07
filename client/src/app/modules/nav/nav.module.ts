import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from './nav/nav.component';
import { MatDesignModule } from 'src/app/modules/common/mat-design/mat-design.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NavComponent
  ],
  imports: [
    CommonModule,
    MatDesignModule,
    RouterModule 
  ],
  exports: [
    NavComponent
  ],
})
export class NavModule { }
