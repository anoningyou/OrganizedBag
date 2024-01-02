import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, of } from 'rxjs';
import { FileTypeEnum } from 'src/app/enums/file-type';
import { ComplectDto } from 'src/app/models/dto/complect-dto';


@Component({
  selector: 'app-complect-items-header-buttons',
  templateUrl: './complect-items-header-buttons.component.html',
  styleUrls: ['./complect-items-header-buttons.component.scss'],

})
export class ComplectItemsHeaderButtonsComponent implements OnInit {
  
  @Input() isReadonly: boolean = false;
  @Input() complect$: Observable<ComplectDto | null> = of(null);


  @Output() onEditComplect: EventEmitter<void> = new EventEmitter();
  @Output() onCloneComplect: EventEmitter<void> = new EventEmitter();  
  @Output() onExportComplect: EventEmitter<FileTypeEnum> = new EventEmitter(); 
  @Output() onImportComplect: EventEmitter<File> = new EventEmitter(); 

  //File

  complectLink$: Observable<string> = of('');

  fileTypeEnum: typeof FileTypeEnum = FileTypeEnum;

  acceptedFiles = '.json,.csv,.xlsx'
  
  constructor( public toastr: ToastrService) {}

  ngOnInit(): void {
    this.complectLink$ = this.complect$.pipe(map(c => {
      if (!!c?.id){
        return `${location.origin}/shared/${c.id}`;
      }
      else
        return '';
    }))
  }
  
  onEditComplectClick() {
    this.onEditComplect.emit();
  }

  onCloneComplectClick() {
    this.onCloneComplect.emit();
  }

  onCopyToClipboard() {
    this.toastr.success('Link was copied to the clipboard');
  }

  onExportComplectClick(fileType: FileTypeEnum) {
    this.onExportComplect.emit(fileType);
  }

  onFileSelected(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length) {
      this.onImportComplect.emit(fileList[0]);
    }
    
  }
}
  

