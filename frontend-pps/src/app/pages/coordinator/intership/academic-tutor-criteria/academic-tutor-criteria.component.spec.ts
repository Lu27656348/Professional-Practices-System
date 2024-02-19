import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicTutorCriteriaComponent } from './academic-tutor-criteria.component';

describe('AcademicTutorCriteriaComponent', () => {
  let component: AcademicTutorCriteriaComponent;
  let fixture: ComponentFixture<AcademicTutorCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcademicTutorCriteriaComponent]
    });
    fixture = TestBed.createComponent(AcademicTutorCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
