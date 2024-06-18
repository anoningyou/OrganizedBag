import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart/chart.component';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatDesignModule } from '../mat-design/mat-design.module';



@NgModule({
  declarations: [
    ChartComponent
  ],
  imports: [
    CommonModule,
    BaseChartDirective ,
    MatDesignModule
  ],
  exports: [
    ChartComponent
  ],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class ChartModule { }
