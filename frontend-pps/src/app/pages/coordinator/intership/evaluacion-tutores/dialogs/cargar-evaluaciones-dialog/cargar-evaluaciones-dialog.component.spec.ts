import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargarEvaluacionesDialogComponent } from './cargar-evaluaciones-dialog.component';

describe('CargarEvaluacionesDialogComponent', () => {
  let component: CargarEvaluacionesDialogComponent;
  let fixture: ComponentFixture<CargarEvaluacionesDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CargarEvaluacionesDialogComponent]
    });
    fixture = TestBed.createComponent(CargarEvaluacionesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
