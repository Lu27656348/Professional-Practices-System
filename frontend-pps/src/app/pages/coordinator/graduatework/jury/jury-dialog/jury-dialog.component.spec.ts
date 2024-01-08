import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JuryDialogComponent } from './jury-dialog.component';

describe('JuryDialogComponent', () => {
  let component: JuryDialogComponent;
  let fixture: ComponentFixture<JuryDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JuryDialogComponent]
    });
    fixture = TestBed.createComponent(JuryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
