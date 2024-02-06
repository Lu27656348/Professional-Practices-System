import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatePasantiaDialogComponent } from './evaluate-pasantia-dialog.component';

describe('EvaluatePasantiaDialogComponent', () => {
  let component: EvaluatePasantiaDialogComponent;
  let fixture: ComponentFixture<EvaluatePasantiaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EvaluatePasantiaDialogComponent]
    });
    fixture = TestBed.createComponent(EvaluatePasantiaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
