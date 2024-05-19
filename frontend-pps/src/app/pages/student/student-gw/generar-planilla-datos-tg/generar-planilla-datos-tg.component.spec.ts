import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPlanillaDatosTGComponent } from './generar-planilla-datos-tg.component';

describe('GenerarPlanillaDatosTGComponent', () => {
  let component: GenerarPlanillaDatosTGComponent;
  let fixture: ComponentFixture<GenerarPlanillaDatosTGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenerarPlanillaDatosTGComponent]
    });
    fixture = TestBed.createComponent(GenerarPlanillaDatosTGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
