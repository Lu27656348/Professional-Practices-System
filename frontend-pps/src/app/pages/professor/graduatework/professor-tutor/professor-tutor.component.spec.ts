import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorTutorComponent } from './professor-tutor.component';

describe('ProfessorTutorComponent', () => {
  let component: ProfessorTutorComponent;
  let fixture: ComponentFixture<ProfessorTutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorTutorComponent]
    });
    fixture = TestBed.createComponent(ProfessorTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
