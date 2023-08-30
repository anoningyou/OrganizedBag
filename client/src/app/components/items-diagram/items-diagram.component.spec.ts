import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsDiagramComponent } from './items-diagram.component';

describe('ItemsDiagramComponent', () => {
  let component: ItemsDiagramComponent;
  let fixture: ComponentFixture<ItemsDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemsDiagramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemsDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
