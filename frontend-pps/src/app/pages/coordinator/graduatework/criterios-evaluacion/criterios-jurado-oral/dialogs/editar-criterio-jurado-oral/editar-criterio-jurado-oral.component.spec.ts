import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriterioJuradoOralComponent } from './editar-criterio-jurado-oral.component';

describe('EditarCriterioJuradoOralComponent', () => {
  let component: EditarCriterioJuradoOralComponent;
  let fixture: ComponentFixture<EditarCriterioJuradoOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCriterioJuradoOralComponent]
    });
    fixture = TestBed.createComponent(EditarCriterioJuradoOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
