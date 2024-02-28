import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCriterioJuradoEscritoComponent } from './crear-criterio-jurado-escrito.component';

describe('CrearCriterioJuradoEscritoComponent', () => {
  let component: CrearCriterioJuradoEscritoComponent;
  let fixture: ComponentFixture<CrearCriterioJuradoEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCriterioJuradoEscritoComponent]
    });
    fixture = TestBed.createComponent(CrearCriterioJuradoEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
