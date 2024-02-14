import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletionDialogComponent } from './completion-dialog.component';

describe('CompletionDialogComponent', () => {
  let component: CompletionDialogComponent;
  let fixture: ComponentFixture<CompletionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletionDialogComponent]
    });
    fixture = TestBed.createComponent(CompletionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
