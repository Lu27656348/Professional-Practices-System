import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaEvaluacionJuradoEscritoComponent } from './pantalla-evaluacion-jurado-escrito.component';

describe('PantallaEvaluacionJuradoEscritoComponent', () => {
  let component: PantallaEvaluacionJuradoEscritoComponent;
  let fixture: ComponentFixture<PantallaEvaluacionJuradoEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PantallaEvaluacionJuradoEscritoComponent]
    });
    fixture = TestBed.createComponent(PantallaEvaluacionJuradoEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
