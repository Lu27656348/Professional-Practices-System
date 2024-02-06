import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaEvaluacionTutorEmpresarialComponent } from './planilla-evaluacion-tutor-empresarial.component';

describe('PlanillaEvaluacionTutorEmpresarialComponent', () => {
  let component: PlanillaEvaluacionTutorEmpresarialComponent;
  let fixture: ComponentFixture<PlanillaEvaluacionTutorEmpresarialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanillaEvaluacionTutorEmpresarialComponent]
    });
    fixture = TestBed.createComponent(PlanillaEvaluacionTutorEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
