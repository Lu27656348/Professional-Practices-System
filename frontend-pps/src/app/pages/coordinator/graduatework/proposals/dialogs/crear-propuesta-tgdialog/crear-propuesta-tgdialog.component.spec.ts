import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPropuestaTGDialogComponent } from './crear-propuesta-tgdialog.component';

describe('CrearPropuestaTGDialogComponent', () => {
  let component: CrearPropuestaTGDialogComponent;
  let fixture: ComponentFixture<CrearPropuestaTGDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearPropuestaTGDialogComponent]
    });
    fixture = TestBed.createComponent(CrearPropuestaTGDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
