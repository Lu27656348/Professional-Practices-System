import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsejoCatalogComponent } from './consejo-catalog.component';

describe('ConsejoCatalogComponent', () => {
  let component: ConsejoCatalogComponent;
  let fixture: ComponentFixture<ConsejoCatalogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsejoCatalogComponent]
    });
    fixture = TestBed.createComponent(ConsejoCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
