import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPlanillaDatosPComponent } from './generar-planilla-datos-p.component';

describe('GenerarPlanillaDatosPComponent', () => {
  let component: GenerarPlanillaDatosPComponent;
  let fixture: ComponentFixture<GenerarPlanillaDatosPComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarPlanillaDatosPComponent]
    });
    fixture = TestBed.createComponent(GenerarPlanillaDatosPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
