import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentacionDialogComponent } from './presentacion-dialog.component';

describe('PresentacionDialogComponent', () => {
  let component: PresentacionDialogComponent;
  let fixture: ComponentFixture<PresentacionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PresentacionDialogComponent]
    });
    fixture = TestBed.createComponent(PresentacionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
