import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriterioTutorEmpresarialComponent } from './editar-criterio-tutor-empresarial.component';

describe('EditarCriterioTutorEmpresarialComponent', () => {
  let component: EditarCriterioTutorEmpresarialComponent;
  let fixture: ComponentFixture<EditarCriterioTutorEmpresarialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCriterioTutorEmpresarialComponent]
    });
    fixture = TestBed.createComponent(EditarCriterioTutorEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
