import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosTutorOralComponent } from './criterios-tutor-oral.component';

describe('CriteriosTutorOralComponent', () => {
  let component: CriteriosTutorOralComponent;
  let fixture: ComponentFixture<CriteriosTutorOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriosTutorOralComponent]
    });
    fixture = TestBed.createComponent(CriteriosTutorOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
