import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerEvaluationDialogComponent } from './reviewer-evaluation-dialog.component';

describe('ReviewerEvaluationDialogComponent', () => {
  let component: ReviewerEvaluationDialogComponent;
  let fixture: ComponentFixture<ReviewerEvaluationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewerEvaluationDialogComponent]
    });
    fixture = TestBed.createComponent(ReviewerEvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
