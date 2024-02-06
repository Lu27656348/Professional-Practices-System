import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCorporativeTutorSeccionComponent } from './edit-corporative-tutor-seccion.component';

describe('EditCorporativeTutorSeccionComponent', () => {
  let component: EditCorporativeTutorSeccionComponent;
  let fixture: ComponentFixture<EditCorporativeTutorSeccionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCorporativeTutorSeccionComponent]
    });
    fixture = TestBed.createComponent(EditCorporativeTutorSeccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
