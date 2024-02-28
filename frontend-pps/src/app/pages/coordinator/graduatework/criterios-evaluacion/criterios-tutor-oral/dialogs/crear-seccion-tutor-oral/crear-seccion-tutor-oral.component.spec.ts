import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSeccionTutorOralComponent } from './crear-seccion-tutor-oral.component';

describe('CrearSeccionTutorOralComponent', () => {
  let component: CrearSeccionTutorOralComponent;
  let fixture: ComponentFixture<CrearSeccionTutorOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearSeccionTutorOralComponent]
    });
    fixture = TestBed.createComponent(CrearSeccionTutorOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
