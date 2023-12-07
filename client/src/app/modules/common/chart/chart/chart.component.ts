import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Chart, ChartData, ChartEvent, ChartOptions, ChartType, LegendElement, LegendItem, Plugin, PluginChartOptions } from 'chart.js';
import { BehaviorSubject, Observable, Subscription, combineLatest, map, of, take } from 'rxjs';
import { ValueTypeEnum } from 'src/app/enums/value-type';
import { IChartValue } from 'src/app/models/chart-value';
import { GroupDto } from 'src/app/models/dto/group-dto';
import { GroupItemDto } from 'src/app/models/dto/group-item-dto';
import PropertyDto from 'src/app/models/dto/property-dto';
import { GroupItem } from 'src/app/models/group-item';
import { IGgoupKeys } from 'src/app/models/group-keys';
import { Item } from 'src/app/models/item';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})

export class ChartComponent implements OnInit, OnDestroy {

//#region fields

  private subsctiptions: Subscription[] = [];   
  chartData: ChartData<'doughnut'> = {} as ChartData<'doughnut'>;
  
  chartOptions: ChartOptions<'doughnut'> = {};
  chartPlugins: Plugin<'doughnut'>[] = [];
  doughnutChartType: ChartType = 'doughnut';

  propertiesDigit$: Observable<PropertyDto []> = of([]);

  private summPropertyIdSource = new BehaviorSubject<string | undefined>(undefined);
  summPropertyId$ = this.summPropertyIdSource.asObservable();
//#endregion

//#region inputs & outputs
  @Input() items$: Observable<Item[] | null> = of([]);
  @Input() properties$: Observable<PropertyDto [] | null> = of([]);
  @Input() groups$: Observable<GroupDto[] | null> = of([]);
  @Input() groupPropertyId$: Observable<string | null> = of(null);
  @Input() categoryGroupId: string = 'category';

  @Input() summPropertyId: string | undefined;
  @Output() summPropertyIdChanged = new EventEmitter<string | undefined >();
  //#endregion

  ngOnInit(): void {
    this.chartPlugins.push(this.getHtmlLegendPlugin());
    this.chartOptions = this.getChartOptions()
    this.summPropertyIdSource.next(this.summPropertyId ?? 'count');

    this.propertiesDigit$ = this.properties$.pipe(map(properties => {
      return properties?.filter(p => p.valueType === ValueTypeEnum.Decimal 
          || p.valueType === ValueTypeEnum.Number) ?? [];
    }));

    const subsctiption = combineLatest([
      this.groups$,
      this.propertiesDigit$,
      this.items$,
      this.groupPropertyId$,
      this.summPropertyId$ 
    ]).subscribe(data => {
      this.chartData = this.getChartData(data[0],data[1],data[2],data[3], data[4]);
    });
    
    this.subsctiptions.push(subsctiption);
  }

  ngOnDestroy(): void {
    this.subsctiptions.forEach(s =>{s.unsubscribe()})
  }

  onSummPropertyIdChanged(id: string) {
    this.summPropertyIdSource.next(id);
    this.summPropertyIdChanged.emit(id);
  }
  //#region Doughnut settings

  getHtmlLegendPlugin() {
    let getOrCreateLegendList = (chart: any, id: any) => {
      const legendContainer = document.getElementById(id);
      let listContainer = legendContainer?.querySelector('ul');
    
      if (!listContainer && legendContainer) {
        listContainer = document.createElement('ul');
        listContainer.className = 'legend'
        legendContainer.appendChild(listContainer);
      }
    
      return listContainer;
    };
    
    let htmlLegendPlugin: Plugin<'doughnut'> = {
      id: 'htmlLegend',
      afterUpdate(chart: any, args: any , options: any) {
        const ul = getOrCreateLegendList(chart, 'legend-container');
    
        while (ul?.firstChild) {
          ul.firstChild.remove();
        }
    
        const items = chart.options.plugins.legend.labels.generateLabels(chart);
        const data = chart.data.datasets[0].data;

        items.forEach((item: any, i: number) => {
          const li = document.createElement('li');
          li.className = 'item'
    
          li.onclick = () => {
            const {type} = chart.config;
            if (type === 'pie' || type === 'doughnut') {
              chart.toggleDataVisibility(item.index);
            } else {
              chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
            }
            chart.update();
          };
    
          // Color box
          const boxSpan = document.createElement('span');
          boxSpan.style.background = item.fillStyle;
          boxSpan.style.borderColor = item.strokeStyle;
          boxSpan.style.borderWidth = item.lineWidth + 'px';
          boxSpan.className = 'marker';
    
          // Text
          const textContainer = document.createElement('p');
          textContainer.className = 'name';
          textContainer.style.color = item.fontColor;
          textContainer.style.textDecoration = item.hidden ? 'line-through' : '';
    
          const text = document.createTextNode(item.text);
          textContainer.appendChild(text);

          // data
          const dataContainer = document.createElement('p');
          dataContainer.className = 'data';
          dataContainer.style.color = item.fontColor;
          dataContainer.style.textDecoration = item.hidden ? 'line-through' : '';
    
          const dataValue = document.createTextNode(data[i]);
          dataContainer.appendChild(dataValue);
    
          li.appendChild(boxSpan);
          li.appendChild(textContainer);
          li.appendChild(dataContainer);
          ul?.appendChild(li);
        });
      }
    };
    return htmlLegendPlugin;
  }
  
  getChartOptions() {
    
    let chartOptions: ChartOptions<'doughnut'>  = {
      responsive: true,
      plugins: {
          // legend: {
          //     display: true,
          //     position: 'right',
          //     labels: {
          //         generateLabels(chart) {
          //           const labels = Chart.overrides.pie.plugins.legend.labels.generateLabels(chart);
          //           const data = chart.data.datasets[0].data;
          //           if(data && labels)
          //           for (let index = 0; index < labels.length; index++) {
          //             const label = labels[index];
          //             label.text = `${label.text} - ${data[index]}`
          //           }
          //           return labels;
          //         },
          //     }
          // }
          legend: {
            display: false,
          }
      }
    }
    return chartOptions;
  }

  //#endregion

  
  getChartData(groups: GroupDto [] | null, properties: PropertyDto [], items: Item[] | null,
              groupPropertyId: string | null, summPropertyId: string | undefined): ChartData<'doughnut'> {
    
    const data: IChartValue [] = [];
    if(groups && items){
      let groupedKeys: IGgoupKeys = {};
      if (!groupPropertyId || groupPropertyId === this.categoryGroupId)
        groupedKeys = this.groupItemsByGroups(groups, items);
      else
        groupedKeys = this.groupItemsByGrouppingField(groups, items, groupPropertyId);

        Object.keys(groupedKeys).forEach(key => {
          data.push({
            key: groupedKeys[key].name,
            value: groupedKeys[key].items.reduce((summ: number, item) => {
              return summ += !summPropertyId || summPropertyId === 'count'
                            ? item.count
                            : +(item.values.find(v => v.id === summPropertyId)?.value ?? '0') * item.count
            }, 0)
          } as IChartValue)
        })
    }
    return {
      labels: data?.map(d=> d.key),
      datasets: [
        { data: data?.map(d=> d.value) },
      ],
    } as ChartData<'doughnut'>;
  }

  getGroupItems(items: Item[], groupItems: GroupItemDto []) : GroupItem[] {
    return groupItems.map(gi => {
      return {
        groupItem: gi,
        item: items.find(i => i.id === gi.itemId)
      }
    })
    .filter(i => i.item)
    .map(i => {
      return Object.assign(new GroupItem, i.item, i.groupItem) as GroupItem
    });
  }

  groupItemsByGroups(groups: GroupDto[], items: Item[]) : IGgoupKeys {
    const groupedKeys : IGgoupKeys = {};
    groups.forEach(group => {   
      groupedKeys[group.id ?? ''] = { 
        name:group.name ?? '',
        items:this.getGroupItems(items, group.items)
      };
    });
    return groupedKeys;
  }

  groupItemsByGrouppingField(groups: GroupDto[], items: Item[], groupPropertyId: string) : IGgoupKeys {
    const complectItems : GroupItem[] = this.getGroupItems(items, groups.map(g => g.items)?.flat() ?? []);
    return complectItems.reduce((group: IGgoupKeys, item) => {
      const key = item.values.find(i => i.id == groupPropertyId)?.value ?? '';
      if (!group[key]) {
       group[key] = {name: key, items: []};
      }
      group[key].items.push(item);
      return group;
    }, {});
  }


  

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
