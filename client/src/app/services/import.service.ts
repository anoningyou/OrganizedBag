import { Injectable } from '@angular/core';
import { read, utils, writeFile } from 'xlsx';
import { ExportComplect } from '../models/export/export-complect';
import { ItemDto } from '../models/dto/item-dto';
import { ExportItem } from '../models/export/export-item';
import { v4 as uuidv4 } from 'uuid';
import { PropertyValueDto } from '../models/dto/property-value-dto';
import { ItemsService } from './items.service';
import { ComplectsService } from './complects.service';
import { ComplectDto } from '../models/dto/complect-dto';
import { GroupDto } from '../models/dto/group-dto';
import { GroupItemDto } from '../models/dto/group-item-dto';
import { ToastrService } from 'ngx-toastr';
import { PropertyIndex } from '../models/export/property-index';
import { take } from 'rxjs';

@Injectable()
export class ImportService {

  constructor(private itemsService: ItemsService,
              private complectsService: ComplectsService,
              private toastr: ToastrService) { }

  importComplect(file: File){
    switch (file.type) {
      case "application/json":
        this.loadJson(file);
        break;
      case "text/csv":
        this.loadCsv(file);
        break;
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        this.loadExcel(file);
        break;
    
      default:
        this.toastr.error(`Unknown file type ${file.type}`)
        break;
    }      
  }

  //#region private
  private loadCsv(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent: ProgressEvent<FileReader> ) => {
        const dataString = fileLoadedEvent.target?.result;
        if (!!dataString && typeof(dataString) === 'string'){
          const csvToRowArray = dataString.split("\n");
          if (!csvToRowArray || !csvToRowArray.length){
            return;
          }

          const headers: string[] = csvToRowArray[0].split(",");

          const dataArray: string[][] = [];
          for (let index = 1; index < csvToRowArray.length - 1; index++) {
            let row = csvToRowArray[index].split(",");
            if (!!row.length)
              dataArray.push(row);
          }
          
          this.addComplectFromArray(headers, dataArray, file.name.replace(/\.[^\.]+$/,''));
        }       
    };

    fileReader.readAsText(file, "UTF-8");
  }

  private loadExcel(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent: ProgressEvent<FileReader> ) => {

        const dataFromFileLoaded = fileLoadedEvent.target?.result;
        if (!!dataFromFileLoaded){
          const workbook = read(dataFromFileLoaded);
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const raw_data = utils.sheet_to_json<string[]>(worksheet, {header: 1});
          if (!!raw_data && raw_data.length){
            this.addComplectFromArray(raw_data[0], raw_data.slice(1), workbook.SheetNames[0]);
          }
        }
    };

    fileReader.readAsArrayBuffer(file);
  }

  private addComplectFromArray(headers: string[], dataArray: string[][], name: string){
    if (!headers || !headers.length){
      this.toastr.error('Heders are empty');
      return;
    }
    if (!dataArray || !dataArray.length){
      this.toastr.error('Data is empty');
      return;
    }

    const groupHeaderIdx = headers.findIndex(h => h.toLowerCase() === 'group');
    const countHeaderIdx = headers.findIndex(h => h.toLowerCase() === 'count');
    this.itemsService.properties$.pipe(take(1)).subscribe(properties => {
      const propertyIndexes: PropertyIndex[] = properties.map(p => {
        return {
          property: p,
          index: headers.findIndex(h => h.toLowerCase() === p.name.toLowerCase())
        } as PropertyIndex
      });

      const itemGroups: {[key: string]: string[][]} = dataArray.reduce((group: {[key: string]: string[][]}, row) => {
        const key = row.filter((item, idx) => idx !== groupHeaderIdx && idx !== countHeaderIdx).join('|');
        (group[key] = group[key] || []).push(row);
        return group;
      }, {});

      const newItems: ItemDto[] = [];

      Object.keys(itemGroups).forEach(key => {
        const itemId = uuidv4();
        itemGroups[key].forEach(row => {
          row.push(itemId);
        });
        newItems.push({
          id: itemId,
          values: propertyIndexes.map(pi => {
            return {
              propertyId: pi.property.id,
              value: pi.index !== -1 ? itemGroups[key][0][pi.index] : null
            } as PropertyValueDto
          })

        } as ItemDto)
      })

      const newComplect = this.getNewComplectFromArray(dataArray, groupHeaderIdx, countHeaderIdx, name);
      
      this.itemsService.addItems(newItems, (items: ItemDto[]) => {
        this.complectsService.addComplect(newComplect);
      })
    })
  }

  private loadJson(file: File) {
    const fileReader = new FileReader();
    fileReader.onload = (fileLoadedEvent: ProgressEvent<FileReader> ) => {

        const textFromFileLoaded = fileLoadedEvent.target?.result;
        if (!!textFromFileLoaded && typeof(textFromFileLoaded) === 'string'){
          const complect: ExportComplect = JSON.parse(textFromFileLoaded) as ExportComplect;
          this.addComplect(complect);
        }
        
    };

    fileReader.readAsText(file, "UTF-8");
  }

  private addComplect(complect: ExportComplect) {
    this.itemsService.properties$.pipe(take(1)).subscribe(properties => {

      const itemGroups: {[key: string]: ExportItem[]} = complect.groups.flatMap(g => g.items)
      .reduce((group: {[key: string]: ExportItem[]}, item) =>{     
        const key: string = !!item.id ? item.id : uuidv4();
        (group[key] = group[key] || []).push(item);
        
        return group;
      },{});
  
      const newItems: ItemDto[] = [];
  
      Object.keys(itemGroups).forEach(key => {
        const newId = uuidv4();
        itemGroups[key].forEach(item => {
          item.id = newId;
        });
        const newItem = {
          id: itemGroups[key][0].id,
          values: itemGroups[key][0].values.map(v => {
            return {
              propertyId: properties.find(p => p.name === v.name)?.id,
              value: v.value
            } as PropertyValueDto
          })
          .filter(p => !!p.propertyId)
        } as ItemDto

        newItems.push(newItem)
      });

      const newComplect = this.getNewComplect(complect);

      this.itemsService.addItems(newItems, (items: ItemDto[]) => {
        this.complectsService.addComplect(newComplect);
      })
    })
  }

  getNewComplect(complect: ExportComplect) : ComplectDto {
    return {
      id: uuidv4(),
      name: complect.name,
      description: complect.description,
      groups: complect.groups.map(g => {
        return {
          id: uuidv4(),
          name: g.name,
          items: g.items.map(i => {
            return {
              count: i.count,
              itemId: i.id
            } as GroupItemDto
          })
        } as GroupDto
      } )
    } as ComplectDto;
  }

  private getNewComplectFromArray(dataArray: string[][], groupHeaderIdx: number, countHeaderIdx: number, name: string, ) : ComplectDto {
    let dataGropus: {[key: string]: string[][]} = {};

      if (groupHeaderIdx !== -1)
        dataGropus = dataArray.reduce((group: {[key: string]: string[][]}, row) => {
          (group[row[groupHeaderIdx]] = group[row[groupHeaderIdx]] || []).push(row);
          return group;
        }, {}) 
      else
        dataGropus['Default group'] = dataArray;

    const newComplect = {
      id: uuidv4(),
      name: name,
      groups: [] as GroupDto[]
    } as ComplectDto;
    
    Object.keys(dataGropus).forEach(key => {
      const groupId = uuidv4();
      newComplect.groups.push({
        id: groupId,
        complectId: newComplect.id,
        name: key,
        items: dataGropus[key].map(row => {
          return {
            groupId: groupId,
            itemId: row[row.length - 1],
            count: countHeaderIdx !== -1 ? +row[countHeaderIdx] : 1
          } as GroupItemDto
        })
      } as GroupDto)
    });
    return newComplect;
  }

  //#endregion private
}

