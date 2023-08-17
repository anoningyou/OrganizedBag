import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ItemsService } from 'src/app/services/items.service';
import { ItemEditDialogComponent } from '../item-edit-dialog/item-edit-dialog.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Item } from 'src/app/models/item';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { PropertyDto } from 'src/app/models/property-dto';
import { PropertyParamDto } from 'src/app/models/property-param-dto';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit{

  private itemsSource = new BehaviorSubject<Item[]>([]);
  items$ = this.itemsSource.asObservable();

  private propertiesSource = new BehaviorSubject<PropertyDto[]>([]);
  properties$ = this.propertiesSource.asObservable();

  private allPropertiesSource = new BehaviorSubject<PropertyDto[]>([]);
  allProperties$ = this.allPropertiesSource.asObservable();
  
  constructor(public itemsService: ItemsService,
    public dialog: MatDialog) {
  }
  ngOnInit(): void {
    this.itemsService.itemObjects$.subscribe((items) => {
      this.itemsSource.next(items);
    });

    this.itemsService.properties$.subscribe((properties) => {
      const listProperties = properties.filter((p) => p.params?.listDisplay)
          .sort((p) => p.params?.listOrder ?? 0);
      this.propertiesSource.next(listProperties);

      const listAllProperties = properties
          .sort((p) => p.params?.listOrder ?? 0);
      this.allPropertiesSource.next(listAllProperties);
    });
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(ItemEditDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  drop(event: CdkDragDrop<Item[] | null>) {
    //console.log(event)
    // if (event.previousContainer === event.container) {
    //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // } else {
    //   transferArrayItem(
    //     event.previousContainer.data,
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex,
    //   );
    // }
  }

  getWidth(property: PropertyDto) {
    return `${property.params?.listWidth ?? 50}px`;
  }

  onItemHeaderSelected(param: PropertyParamDto){
    this.itemsService.updatePropertyParam(param)
  }

}
