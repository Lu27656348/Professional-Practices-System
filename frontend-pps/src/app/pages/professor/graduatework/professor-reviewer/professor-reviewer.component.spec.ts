import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorReviewerComponent } from './professor-reviewer.component';

describe('ProfessorReviewerComponent', () => {
  let component: ProfessorReviewerComponent;
  let fixture: ComponentFixture<ProfessorReviewerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorReviewerComponent]
    });
    fixture = TestBed.createComponent(ProfessorReviewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
