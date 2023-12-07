import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { NgChartsModule } from 'ng2-charts';
import { MatDesignModule } from '../mat-design/mat-design.module';



@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    NgChartsModule,
    MatDesignModule
  ],
  exports: [
    ChartComponent
  ]
})
export class ChartModule { }
