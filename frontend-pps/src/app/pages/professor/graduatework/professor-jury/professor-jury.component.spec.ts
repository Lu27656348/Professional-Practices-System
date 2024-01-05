import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorJuryComponent } from './professor-jury.component';

describe('ProfessorJuryComponent', () => {
  let component: ProfessorJuryComponent;
  let fixture: ComponentFixture<ProfessorJuryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorJuryComponent]
    });
    fixture = TestBed.createComponent(ProfessorJuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
