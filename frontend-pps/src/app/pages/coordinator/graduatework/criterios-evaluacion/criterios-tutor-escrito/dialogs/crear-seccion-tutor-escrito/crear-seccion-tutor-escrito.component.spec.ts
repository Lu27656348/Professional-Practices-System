import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSeccionTutorEscritoComponent } from './crear-seccion-tutor-escrito.component';

describe('CrearSeccionTutorEscritoComponent', () => {
  let component: CrearSeccionTutorEscritoComponent;
  let fixture: ComponentFixture<CrearSeccionTutorEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearSeccionTutorEscritoComponent]
    });
    fixture = TestBed.createComponent(CrearSeccionTutorEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
