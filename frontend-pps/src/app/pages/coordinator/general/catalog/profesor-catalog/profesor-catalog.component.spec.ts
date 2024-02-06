import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorCatalogComponent } from './profesor-catalog.component';

describe('ProfesorCatalogComponent', () => {
  let component: ProfesorCatalogComponent;
  let fixture: ComponentFixture<ProfesorCatalogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorCatalogComponent]
    });
    fixture = TestBed.createComponent(ProfesorCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
