import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosProfesorRevisorComponent } from './criterios-profesor-revisor.component';

describe('CriteriosProfesorRevisorComponent', () => {
  let component: CriteriosProfesorRevisorComponent;
  let fixture: ComponentFixture<CriteriosProfesorRevisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriosProfesorRevisorComponent]
    });
    fixture = TestBed.createComponent(CriteriosProfesorRevisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
