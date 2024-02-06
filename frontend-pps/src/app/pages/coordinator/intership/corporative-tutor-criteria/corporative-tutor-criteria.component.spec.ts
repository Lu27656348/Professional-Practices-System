import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporativeTutorCriteriaComponent } from './corporative-tutor-criteria.component';

describe('CorporativeTutorCriteriaComponent', () => {
  let component: CorporativeTutorCriteriaComponent;
  let fixture: ComponentFixture<CorporativeTutorCriteriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CorporativeTutorCriteriaComponent]
    });
    fixture = TestBed.createComponent(CorporativeTutorCriteriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
