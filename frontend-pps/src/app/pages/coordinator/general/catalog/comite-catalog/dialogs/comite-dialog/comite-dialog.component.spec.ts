import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComiteDialogComponent } from './comite-dialog.component';

describe('ComiteDialogComponent', () => {
  let component: ComiteDialogComponent;
  let fixture: ComponentFixture<ComiteDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComiteDialogComponent]
    });
    fixture = TestBed.createComponent(ComiteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
