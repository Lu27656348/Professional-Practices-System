import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCriterioTutorOralComponent } from './editar-criterio-tutor-oral.component';

describe('EditarCriterioTutorOralComponent', () => {
  let component: EditarCriterioTutorOralComponent;
  let fixture: ComponentFixture<EditarCriterioTutorOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarCriterioTutorOralComponent]
    });
    fixture = TestBed.createComponent(EditarCriterioTutorOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
