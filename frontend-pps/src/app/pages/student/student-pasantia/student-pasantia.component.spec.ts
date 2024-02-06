import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPasantiaComponent } from './student-pasantia.component';

describe('StudentPasantiaComponent', () => {
  let component: StudentPasantiaComponent;
  let fixture: ComponentFixture<StudentPasantiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentPasantiaComponent]
    });
    fixture = TestBed.createComponent(StudentPasantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
