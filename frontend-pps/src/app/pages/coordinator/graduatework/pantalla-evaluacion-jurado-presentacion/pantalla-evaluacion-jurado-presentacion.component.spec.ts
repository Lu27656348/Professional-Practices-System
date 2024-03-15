import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaEvaluacionJuradoPresentacionComponent } from './pantalla-evaluacion-jurado-presentacion.component';

describe('PantallaEvaluacionJuradoPresentacionComponent', () => {
  let component: PantallaEvaluacionJuradoPresentacionComponent;
  let fixture: ComponentFixture<PantallaEvaluacionJuradoPresentacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PantallaEvaluacionJuradoPresentacionComponent]
    });
    fixture = TestBed.createComponent(PantallaEvaluacionJuradoPresentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
