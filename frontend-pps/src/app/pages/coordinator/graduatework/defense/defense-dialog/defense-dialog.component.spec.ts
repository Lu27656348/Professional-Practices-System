import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseDialogComponent } from './defense-dialog.component';

describe('DefenseDialogComponent', () => {
  let component: DefenseDialogComponent;
  let fixture: ComponentFixture<DefenseDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefenseDialogComponent]
    });
    fixture = TestBed.createComponent(DefenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
