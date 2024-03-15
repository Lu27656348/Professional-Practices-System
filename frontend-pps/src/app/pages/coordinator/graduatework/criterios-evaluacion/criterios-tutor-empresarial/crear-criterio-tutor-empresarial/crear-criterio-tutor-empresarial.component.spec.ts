import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCriterioTutorEmpresarialComponent } from './crear-criterio-tutor-empresarial.component';

describe('CrearCriterioTutorEmpresarialComponent', () => {
  let component: CrearCriterioTutorEmpresarialComponent;
  let fixture: ComponentFixture<CrearCriterioTutorEmpresarialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCriterioTutorEmpresarialComponent]
    });
    fixture = TestBed.createComponent(CrearCriterioTutorEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
