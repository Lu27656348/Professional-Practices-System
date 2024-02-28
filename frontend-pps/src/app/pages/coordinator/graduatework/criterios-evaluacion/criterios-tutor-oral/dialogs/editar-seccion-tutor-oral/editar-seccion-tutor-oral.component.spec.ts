import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarSeccionTutorOralComponent } from './editar-seccion-tutor-oral.component';

describe('EditarSeccionTutorOralComponent', () => {
  let component: EditarSeccionTutorOralComponent;
  let fixture: ComponentFixture<EditarSeccionTutorOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarSeccionTutorOralComponent]
    });
    fixture = TestBed.createComponent(EditarSeccionTutorOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
