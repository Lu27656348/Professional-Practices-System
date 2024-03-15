import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaEvaluacionComponent } from './pantalla-evaluacion.component';

describe('PantallaEvaluacionComponent', () => {
  let component: PantallaEvaluacionComponent;
  let fixture: ComponentFixture<PantallaEvaluacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PantallaEvaluacionComponent]
    });
    fixture = TestBed.createComponent(PantallaEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
