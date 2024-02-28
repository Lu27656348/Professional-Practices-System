import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCorporateTutorCriteriaComponent } from './create-corporate-tutor-criteria.component';

describe('CreateCorporateTutorCriteriaComponent', () => {
  let component: CreateCorporateTutorCriteriaComponent;
  let fixture: ComponentFixture<CreateCorporateTutorCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCorporateTutorCriteriaComponent]
    });
    fixture = TestBed.createComponent(CreateCorporateTutorCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
