import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComplectEditDialogComponent } from '../complect-edit-dialog/complect-edit-dialog.component';
import { ComplectDto } from 'src/app/models/dto/complect-dto';
import { YesNoComponent } from 'src/app/common/dialog/yes-no/yes-no.component';
import { GroupItemDto } from 'src/app/models/dto/group-item-dto';
import { ToastrService } from 'ngx-toastr';
import { GroupDto } from 'src/app/models/dto/group-dto';
import { ComplectsService } from 'src/app/services/complects.service';



@Component({
  selector: 'app-complects',
  templateUrl: './complects.component.html',
  styleUrls: ['./complects.component.scss']
})
export class ComplectsComponent {

  @Input() complects: ComplectDto[] | null = [];
  @Input() currentComplect: ComplectDto | null = null;
  @Output() currentComplectChange = new EventEmitter<ComplectDto | null>();


  constructor(public complectsService: ComplectsService,
    public dialog: MatDialog,
    private toastr: ToastrService) {
  }

  getOrderedComplects() {
    return this.complects?.sort((a,b) => a.name.localeCompare(b.name)) ?? [];
  }

  openAddComplectDialog(): void {
    const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.currentComplectChange.emit(result);
    });
  }

  openEditComplectDialog(complect: ComplectDto): void {
    const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
      data: complect,
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openCloneComplectDialog(complect: ComplectDto): void {
    const newItem = Object.assign({} as ComplectDto, complect);
    newItem.id = '';
    newItem.groups = complect.groups.map(g => {
      const group = Object.assign({} as GroupDto, g);
      group.id = undefined;
      group.complectId = '';
      group.items = g.items.map(i => Object.assign({} as GroupItemDto, i))
      return group;
    });
    const dialogRef = this.dialog.open(ComplectEditDialogComponent, {
      data: newItem,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.currentComplectChange.emit(result);
    });
  }

  openDeleteComplectDialog(complect: ComplectDto): void {
    const dialogRef = this.dialog.open(YesNoComponent, {
      data: 'Delete complect?',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && complect.id)
        this.complectsService.deleteComplect(complect.id).subscribe({
          next: () =>{
              this.toastr.info('Done!');
              if (complect.id === this.currentComplect?.id)
                this.currentComplectChange.emit(!!this.complects?.length ? this.complects[0] : null);
            },
          error: error => this.toastr.error(error.error)
        })
    });
  }

  onComplectClick(complect: ComplectDto) {
    this.currentComplectChange.emit(complect);
  }

}
