import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesarrolloTgDialogComponent } from './desarrollo-tg-dialog.component';

describe('DesarrolloTgDialogComponent', () => {
  let component: DesarrolloTgDialogComponent;
  let fixture: ComponentFixture<DesarrolloTgDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesarrolloTgDialogComponent]
    });
    fixture = TestBed.createComponent(DesarrolloTgDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
