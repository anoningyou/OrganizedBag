import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/models/property';
import { ItemsService } from 'src/app/services/items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit{
  
  properties: Property[] = [];

  constructor(private itemsService: ItemsService) {
  }

  ngOnInit(): void {
    this.itemsService.getProperties().subscribe({
      next: response => {
        this.properties = response;
      }
    })
  }

}
