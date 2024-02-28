import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosTutorEscritoComponent } from './criterios-tutor-escrito.component';

describe('CriteriosTutorEscritoComponent', () => {
  let component: CriteriosTutorEscritoComponent;
  let fixture: ComponentFixture<CriteriosTutorEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriosTutorEscritoComponent]
    });
    fixture = TestBed.createComponent(CriteriosTutorEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
