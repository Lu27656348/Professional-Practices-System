import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSeccionJuradoEscritoComponent } from './crear-seccion-jurado-escrito.component';

describe('CrearSeccionJuradoEscritoComponent', () => {
  let component: CrearSeccionJuradoEscritoComponent;
  let fixture: ComponentFixture<CrearSeccionJuradoEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearSeccionJuradoEscritoComponent]
    });
    fixture = TestBed.createComponent(CrearSeccionJuradoEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
