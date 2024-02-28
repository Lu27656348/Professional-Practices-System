import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCorporateTutorSeccionComponent } from './create-corporate-tutor-seccion.component';

describe('CreateCorporateTutorSeccionComponent', () => {
  let component: CreateCorporateTutorSeccionComponent;
  let fixture: ComponentFixture<CreateCorporateTutorSeccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCorporateTutorSeccionComponent]
    });
    fixture = TestBed.createComponent(CreateCorporateTutorSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
