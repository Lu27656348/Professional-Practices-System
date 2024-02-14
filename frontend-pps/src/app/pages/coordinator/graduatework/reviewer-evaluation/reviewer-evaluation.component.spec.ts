import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerEvaluationComponent } from './reviewer-evaluation.component';

describe('ReviewerEvaluationComponent', () => {
  let component: ReviewerEvaluationComponent;
  let fixture: ComponentFixture<ReviewerEvaluationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewerEvaluationComponent]
    });
    fixture = TestBed.createComponent(ReviewerEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
