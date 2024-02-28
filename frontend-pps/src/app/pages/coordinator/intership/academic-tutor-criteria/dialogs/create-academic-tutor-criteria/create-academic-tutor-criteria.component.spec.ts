import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAcademicTutorCriteriaComponent } from './create-academic-tutor-criteria.component';

describe('CreateAcademicTutorCriteriaComponent', () => {
  let component: CreateAcademicTutorCriteriaComponent;
  let fixture: ComponentFixture<CreateAcademicTutorCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateAcademicTutorCriteriaComponent]
    });
    fixture = TestBed.createComponent(CreateAcademicTutorCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
