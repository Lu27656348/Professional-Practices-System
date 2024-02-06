import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanillaEvaluacionTutorAcademicoComponent } from './planilla-evaluacion-tutor-academico.component';

describe('PlanillaEvaluacionTutorAcademicoComponent', () => {
  let component: PlanillaEvaluacionTutorAcademicoComponent;
  let fixture: ComponentFixture<PlanillaEvaluacionTutorAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanillaEvaluacionTutorAcademicoComponent]
    });
    fixture = TestBed.createComponent(PlanillaEvaluacionTutorAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
