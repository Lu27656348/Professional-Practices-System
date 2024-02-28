import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriterioJuradoEscritoComponent } from './editar-criterio-jurado-escrito.component';

describe('EditarCriterioJuradoEscritoComponent', () => {
  let component: EditarCriterioJuradoEscritoComponent;
  let fixture: ComponentFixture<EditarCriterioJuradoEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCriterioJuradoEscritoComponent]
    });
    fixture = TestBed.createComponent(EditarCriterioJuradoEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
