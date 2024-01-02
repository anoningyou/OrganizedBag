import { Injectable } from '@angular/core';
import { SharedComplect } from '../models/shared-complest';
import { ExportFile } from '../models/export/export-file';
import { FileTypeEnum } from '../enums/file-type';
import { ExportComplect } from '../models/export/export-complect';
import { ExportGroup } from '../models/export/export-group';
import { GroupItemDto } from '../models/dto/group-item-dto';
import { Item } from '../models/item';
import { ExportItem } from '../models/export/export-item';
import { ExportProperty } from '../models/export/export-property';
import { read, utils, writeFile } from 'xlsx';
import { ValueTypeEnum } from '../enums/value-type';

@Injectable()
export class ExportService {
  constructor() {}

  saveToFile(complect: SharedComplect, fileType: FileTypeEnum) {
    switch (fileType) {
      case FileTypeEnum.CSV:
        this.saveCsvFile(complect);
        break;
      case FileTypeEnum.XLSX:
        this.saveExcelFile(complect);
        break;
      case FileTypeEnum.JSON:
      default:
        this.saveJsonFile(complect);
        break;
    }
  }

  //#region private

  private getExportComplect(complect: SharedComplect): ExportComplect {
    return {
      name: complect.complect.name,
      description: complect.complect.description,
      groups: complect.complect.groups.map((g) => {
        return {
          name: g.name,
          items: g.items.map((i) => this.getExportItem(i, complect.items)),
        } as ExportGroup;
      }),
    } as ExportComplect;
  }

  private getExportItem(dto: GroupItemDto, items: Item[]): ExportItem {
    return {
      id: dto.itemId,
      count: dto.count,
      values: items
        .find((i) => i.id === dto.itemId)
        ?.values?.map((p) => {
          return {
            id: p.id,
            attributes: p.attributes,
            name: p.name,
            valueType: p.valueType,
            value: p.value,
          } as ExportProperty;
        }),
    } as ExportItem;
  }

  private getDataArray(groups: ExportGroup[]): any[][] {
    const result: any[][] = [];
    groups.forEach((group) => {
      group.items.forEach((item) => {
        let row: any[] = [group.name];
        row = row.concat(
          item.values.map((v) => {
            switch (v.valueType) {
              case ValueTypeEnum.Number:
              case ValueTypeEnum.Decimal:
                return !!v.value ? +v.value : v.value;
              case ValueTypeEnum.Date:
                if (!!v.value) {
                  let date = new Date(Date.parse(v.value));
                  return date.toLocaleDateString();
                } else return null;
              default:
                return v.value;
            }
          })
        );
        row.push(item.count)

        result.push(row);
      });
    });
    return result;
  }

  private downoadFile(exportFile: ExportFile) {
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `${exportFile.type},${encodeURIComponent(exportFile.data)}`
    );
    element.setAttribute('download', exportFile.name);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  private saveExcelFile(complect: SharedComplect) {
    const exportComplect = this.getExportComplect(complect);

    const headers = ['Group'];
    exportComplect.groups[0]?.items[0]?.values.forEach((property) => {
      headers.push(property.name);
    });
    headers.push('Count');

    const wb = utils.book_new();
    const ws: any = utils.json_to_sheet([]);
    utils.sheet_add_aoa(ws, [headers]);
    utils.sheet_add_aoa(ws, this.getDataArray(exportComplect.groups), {
      origin: 'A2',
    });
    utils.book_append_sheet(wb, ws, exportComplect.name);
    writeFile(wb, `${exportComplect.name}.xlsx`);
  }

  private saveJsonFile(complect: SharedComplect) {
    const exportComplect = this.getExportComplect(complect);

    this.downoadFile( {
      data: JSON.stringify(exportComplect),
      name: `${exportComplect.name}.json`,
      type: 'data:text/json;charset=utf-8',
    } as ExportFile);
  }

  private saveCsvFile(sharedComplect: SharedComplect) {
    const complect = this.getExportComplect(sharedComplect);
    let csvContent = '';

    const headers = ['Group'];
    complect.groups[0]?.items[0]?.values.forEach((property) => {
      headers.push(property.name);
    });
    headers.push('Count');
    
    csvContent += headers.join(',') + '\n';

    const data = this.getDataArray(complect.groups);
    data.forEach(row => {
      csvContent += row.map(v => v || '').join(',') + '\n';
    });

    this.downoadFile( {
      data: csvContent,
      name: `${complect.name}.csv`,
      type: 'data:text/csv;charset=utf-8',
    } as ExportFile);
  }

  //#endregion
}


