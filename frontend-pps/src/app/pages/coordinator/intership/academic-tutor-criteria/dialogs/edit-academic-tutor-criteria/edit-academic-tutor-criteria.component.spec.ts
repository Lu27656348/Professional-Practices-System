import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAcademicTutorCriteriaComponent } from './edit-academic-tutor-criteria.component';

describe('EditAcademicTutorCriteriaComponent', () => {
  let component: EditAcademicTutorCriteriaComponent;
  let fixture: ComponentFixture<EditAcademicTutorCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAcademicTutorCriteriaComponent]
    });
    fixture = TestBed.createComponent(EditAcademicTutorCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
