import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsejoDialogComponent } from './consejo-dialog.component';

describe('ConsejoDialogComponent', () => {
  let component: ConsejoDialogComponent;
  let fixture: ComponentFixture<ConsejoDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsejoDialogComponent]
    });
    fixture = TestBed.createComponent(ConsejoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
