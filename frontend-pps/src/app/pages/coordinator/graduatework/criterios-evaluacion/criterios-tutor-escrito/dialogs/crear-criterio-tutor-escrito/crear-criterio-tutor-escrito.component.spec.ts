import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCriterioTutorEscritoComponent } from './crear-criterio-tutor-escrito.component';

describe('CrearCriterioTutorEscritoComponent', () => {
  let component: CrearCriterioTutorEscritoComponent;
  let fixture: ComponentFixture<CrearCriterioTutorEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCriterioTutorEscritoComponent]
    });
    fixture = TestBed.createComponent(CrearCriterioTutorEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
