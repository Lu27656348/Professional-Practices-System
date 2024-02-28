import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriterioTutorEscritoComponent } from './editar-criterio-tutor-escrito.component';

describe('EditarCriterioTutorEscritoComponent', () => {
  let component: EditarCriterioTutorEscritoComponent;
  let fixture: ComponentFixture<EditarCriterioTutorEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCriterioTutorEscritoComponent]
    });
    fixture = TestBed.createComponent(EditarCriterioTutorEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
