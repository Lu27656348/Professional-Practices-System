import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresaCatalogComponent } from './empresa-catalog.component';

describe('EmpresaCatalogComponent', () => {
  let component: EmpresaCatalogComponent;
  let fixture: ComponentFixture<EmpresaCatalogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmpresaCatalogComponent]
    });
    fixture = TestBed.createComponent(EmpresaCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
