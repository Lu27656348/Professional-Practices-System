import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSeccionTutorEscritoComponent } from './editar-seccion-tutor-escrito.component';

describe('EditarSeccionTutorEscritoComponent', () => {
  let component: EditarSeccionTutorEscritoComponent;
  let fixture: ComponentFixture<EditarSeccionTutorEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarSeccionTutorEscritoComponent]
    });
    fixture = TestBed.createComponent(EditarSeccionTutorEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
