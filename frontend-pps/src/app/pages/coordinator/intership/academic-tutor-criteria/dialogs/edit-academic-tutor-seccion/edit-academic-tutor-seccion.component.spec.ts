import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcademicTutorSeccionComponent } from './edit-academic-tutor-seccion.component';

describe('EditAcademicTutorSeccionComponent', () => {
  let component: EditAcademicTutorSeccionComponent;
  let fixture: ComponentFixture<EditAcademicTutorSeccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAcademicTutorSeccionComponent]
    });
    fixture = TestBed.createComponent(EditAcademicTutorSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
