import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCorporativeTutorCriteriaComponent } from './edit-corporative-tutor-criteria.component';

describe('EditCorporativeTutorCriteriaComponent', () => {
  let component: EditCorporativeTutorCriteriaComponent;
  let fixture: ComponentFixture<EditCorporativeTutorCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCorporativeTutorCriteriaComponent]
    });
    fixture = TestBed.createComponent(EditCorporativeTutorCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
