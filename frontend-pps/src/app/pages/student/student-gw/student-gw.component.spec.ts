import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentGWComponent } from './student-gw.component';

describe('StudentGWComponent', () => {
  let component: StudentGWComponent;
  let fixture: ComponentFixture<StudentGWComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentGWComponent]
    });
    fixture = TestBed.createComponent(StudentGWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
