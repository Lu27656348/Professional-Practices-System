import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluacionTutoresComponent } from './evaluacion-tutores.component';

describe('EvaluacionTutoresComponent', () => {
  let component: EvaluacionTutoresComponent;
  let fixture: ComponentFixture<EvaluacionTutoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluacionTutoresComponent]
    });
    fixture = TestBed.createComponent(EvaluacionTutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
