import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorJuryDialogComponent } from './professor-jury-dialog.component';

describe('ProfessorJuryDialogComponent', () => {
  let component: ProfessorJuryDialogComponent;
  let fixture: ComponentFixture<ProfessorJuryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorJuryDialogComponent]
    });
    fixture = TestBed.createComponent(ProfessorJuryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
