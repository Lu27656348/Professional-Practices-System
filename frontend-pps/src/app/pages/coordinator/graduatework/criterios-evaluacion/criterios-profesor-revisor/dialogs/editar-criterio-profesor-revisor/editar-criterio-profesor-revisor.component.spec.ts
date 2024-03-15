import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriterioProfesorRevisorComponent } from './editar-criterio-profesor-revisor.component';

describe('EditarCriterioProfesorRevisorComponent', () => {
  let component: EditarCriterioProfesorRevisorComponent;
  let fixture: ComponentFixture<EditarCriterioProfesorRevisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCriterioProfesorRevisorComponent]
    });
    fixture = TestBed.createComponent(EditarCriterioProfesorRevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
