import { group } from '@angular/animations';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Chart, ChartData, ChartEvent, ChartOptions, ChartType, LegendElement, LegendItem } from 'chart.js';
import { GroupDto } from 'src/app/models/dto/group-dto';
import PropertyDto from 'src/app/models/dto/property-dto';
import { Item } from 'src/app/models/item';



@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit, OnChanges {

//#region fields
  chartData: ChartData<'doughnut'> = {} as ChartData<'doughnut'>;

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: false,
    plugins: {
        legend: {
            display: true,
            position: 'right',
            labels: {
                generateLabels(chart) {
                  const labels = Chart.overrides.pie.plugins.legend.labels.generateLabels(chart);
                  const data = chart.data.datasets[0].data;
                  if(data && labels)
                  for (let index = 0; index < labels.length; index++) {
                    const label = labels[index];
                    label.text = `${label.text} - ${data[index]}`
                  }
                  return labels;
                },
            }
        }
    }
}

//#endregion

//#region inputs

  //#region items
  private _items: Item[]  | null = [];
  @Input() 
    set items(items: Item[]  | null) {
      this._items = items;
    }
    get items() { return this._items; }
  //#endregion

  //#region properties
  private _properties: PropertyDto [] = [];
  @Input() 
    set properties(properties: PropertyDto [] | null) {
      this._properties = properties ?? [];
      //this.reloadChartData();
    }
    get properties() { return this._properties; }
  //#endregion

  //#region groups
  private _groups: GroupDto [] = [];
  @Input() 
    set groups(groups: GroupDto [] | null | undefined) {
      this._groups = groups ?? [];
      //this.reloadChartData();
    }
    get groups() { return this._groups; }
  //#endregion

  //#region categoryGroupId
  @Input() categoryGroupId: string = 'category';
  //#endregion

  //#region groupPropertyId
  private _groupPropertyId: string | undefined | null = this.categoryGroupId;
  @Input() 
    set groupPropertyId(groupPropertyId: string | undefined | null) {
      this._groupPropertyId = groupPropertyId ?? this.categoryGroupId;
      this.reloadChartData();
    }
    get groupPropertyId() { return this._groupPropertyId; }
  //#endregion

  //#region summPropertyId
  private _summPropertyId: string | undefined | null;
  @Input() 
    set summPropertyId(summPropertyId: string | undefined | null) {
      this._summPropertyId = summPropertyId;
      this.reloadChartData();
    }
    get summPropertyId() { return this._summPropertyId; }
  @Output() summPropertyIdChange: EventEmitter<string | null> = new EventEmitter();
  //#endregion

  //#endregion

  ngOnInit(): void {
    this.reloadChartData();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes)
    this.reloadChartData();
  }

  // Doughnut

  reloadChartData() {
    this.chartData = this.getChartData();
  }

  getChartData(): ChartData<'doughnut'> {
    const data = this.groups?.map(g=> {
      return {
        key: g.name,
        value: g.items.length
      }
    })
    return {
      labels: data?.map(d=> d.key),
      datasets: [
        { data: data?.map(d=> d.value) },
      ],
    } as ChartData<'doughnut'>;
  }

  public doughnutChartType: ChartType = 'doughnut';

  // events
  public chartClicked({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    //console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
    //console.log(event, active);
  }
}
