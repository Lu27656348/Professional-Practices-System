import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesionalDialogComponent } from './profesional-dialog.component';

describe('ProfesionalDialogComponent', () => {
  let component: ProfesionalDialogComponent;
  let fixture: ComponentFixture<ProfesionalDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesionalDialogComponent]
    });
    fixture = TestBed.createComponent(ProfesionalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
