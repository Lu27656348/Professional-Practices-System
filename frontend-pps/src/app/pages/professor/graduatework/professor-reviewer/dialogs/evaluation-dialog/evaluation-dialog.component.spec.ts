import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationDialogComponent } from './evaluation-dialog.component';

describe('EvaluationDialogComponent', () => {
  let component: EvaluationDialogComponent;
  let fixture: ComponentFixture<EvaluationDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluationDialogComponent]
    });
    fixture = TestBed.createComponent(EvaluationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
