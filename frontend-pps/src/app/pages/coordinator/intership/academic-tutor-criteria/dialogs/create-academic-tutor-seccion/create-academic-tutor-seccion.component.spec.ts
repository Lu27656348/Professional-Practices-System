import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcademicTutorSeccionComponent } from './create-academic-tutor-seccion.component';

describe('CreateAcademicTutorSeccionComponent', () => {
  let component: CreateAcademicTutorSeccionComponent;
  let fixture: ComponentFixture<CreateAcademicTutorSeccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAcademicTutorSeccionComponent]
    });
    fixture = TestBed.createComponent(CreateAcademicTutorSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
