import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { ComplectDto } from 'src/app/models/complect-dto';
import { Item } from 'src/app/models/item';
import { ItemsService } from 'src/app/services/items.service';
import { ComplectEditDialogComponent } from '../complect-edit-dialog/complect-edit-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-complect-items',
  templateUrl: './complect-items.component.html',
  styleUrls: ['./complect-items.component.scss']
})
export class ComplectItemsComponent implements OnInit {
  private itemObjectsSource = new BehaviorSubject<Item[]>([]);
  itemObjects$ = this.itemObjectsSource.asObservable();
  complect: ComplectDto | null = null;
  
   
  constructor(public itemsService: ItemsService,
    public dialog: MatDialog,
    public toastr: ToastrService) {
  }
  ngOnInit(): void {
    this.itemsService.itemObjects$.subscribe(items => {
      this.itemsService.currrentComplect$.pipe(take(1)).subscribe(complect => {
        let complectItems: Item[] = [];
        if(complect)
          complectItems = items.filter(i => (complect.items.findIndex(ci => ci.itemId === i.id) ?? -1) >=0);
        this.itemObjectsSource.next(complectItems);
      })
    })

    this.itemsService.currrentComplect$.subscribe(complect => {
      this.complect = complect;
      if(complect)
        this.itemsService.itemObjects$.pipe(take(1)).subscribe(items => {
            const  complectItems = (items ?? []).filter(i => (complect.items.findIndex(ci => ci.itemId === i.id) ?? -1) >=0);
            this.itemObjectsSource.next(complectItems);
        })
    })
  }
 
  openEditComplectDialog(): void {
    const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
      data: this.complect,
    });

    dialogRef.afterClosed().subscribe(result => {
      this.complect = result;
    });
  }

  drop(event: CdkDragDrop<Item[] | null>) {
    console.log(event)
    if (!event.previousContainer.data || ! this.complect)
      return;
    if (event.previousContainer === event.container) {
      //moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      this.itemsService.addItemToComplect(item, this.complect).subscribe({
        next: () =>{
          this.toastr.info('Saved!');
        },
        error: error => this.toastr.error(error.error)
      });
      
      // transferArrayItem(
      //   event.previousContainer.data,
      //   event.container.data,
      //   event.previousIndex,
      //   event.currentIndex,
      // );
    }
  }

}
