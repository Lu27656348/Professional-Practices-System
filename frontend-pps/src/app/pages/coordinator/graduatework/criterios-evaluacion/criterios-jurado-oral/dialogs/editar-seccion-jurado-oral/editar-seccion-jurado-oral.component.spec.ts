import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSeccionJuradoOralComponent } from './editar-seccion-jurado-oral.component';

describe('EditarSeccionJuradoOralComponent', () => {
  let component: EditarSeccionJuradoOralComponent;
  let fixture: ComponentFixture<EditarSeccionJuradoOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarSeccionJuradoOralComponent]
    });
    fixture = TestBed.createComponent(EditarSeccionJuradoOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
