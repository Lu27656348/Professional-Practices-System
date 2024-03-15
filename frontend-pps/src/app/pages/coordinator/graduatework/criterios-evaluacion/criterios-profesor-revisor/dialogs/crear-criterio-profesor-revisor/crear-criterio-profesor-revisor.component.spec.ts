import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCriterioProfesorRevisorComponent } from './crear-criterio-profesor-revisor.component';

describe('CrearCriterioProfesorRevisorComponent', () => {
  let component: CrearCriterioProfesorRevisorComponent;
  let fixture: ComponentFixture<CrearCriterioProfesorRevisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCriterioProfesorRevisorComponent]
    });
    fixture = TestBed.createComponent(CrearCriterioProfesorRevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
