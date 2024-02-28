import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCriterioTutorOralComponent } from './crear-criterio-tutor-oral.component';

describe('CrearCriterioTutorOralComponent', () => {
  let component: CrearCriterioTutorOralComponent;
  let fixture: ComponentFixture<CrearCriterioTutorOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCriterioTutorOralComponent]
    });
    fixture = TestBed.createComponent(CrearCriterioTutorOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
