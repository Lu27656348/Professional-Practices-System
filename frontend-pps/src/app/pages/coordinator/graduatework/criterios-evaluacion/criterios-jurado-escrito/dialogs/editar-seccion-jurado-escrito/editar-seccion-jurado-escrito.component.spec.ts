import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSeccionJuradoEscritoComponent } from './editar-seccion-jurado-escrito.component';

describe('EditarSeccionJuradoEscritoComponent', () => {
  let component: EditarSeccionJuradoEscritoComponent;
  let fixture: ComponentFixture<EditarSeccionJuradoEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarSeccionJuradoEscritoComponent]
    });
    fixture = TestBed.createComponent(EditarSeccionJuradoEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
