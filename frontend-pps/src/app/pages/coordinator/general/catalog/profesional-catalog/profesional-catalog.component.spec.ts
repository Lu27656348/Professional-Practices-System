import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalCatalogComponent } from './profesional-catalog.component';

describe('ProfesionalCatalogComponent', () => {
  let component: ProfesionalCatalogComponent;
  let fixture: ComponentFixture<ProfesionalCatalogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesionalCatalogComponent]
    });
    fixture = TestBed.createComponent(ProfesionalCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
