import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfesorDialogComponent } from './profesor-dialog.component';

describe('ProfesorDialogComponent', () => {
  let component: ProfesorDialogComponent;
  let fixture: ComponentFixture<ProfesorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfesorDialogComponent]
    });
    fixture = TestBed.createComponent(ProfesorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
