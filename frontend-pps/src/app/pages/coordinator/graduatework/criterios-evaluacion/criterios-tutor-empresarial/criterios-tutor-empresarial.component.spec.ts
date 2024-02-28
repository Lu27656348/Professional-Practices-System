import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosTutorEmpresarialComponent } from './criterios-tutor-empresarial.component';

describe('CriteriosTutorEmpresarialComponent', () => {
  let component: CriteriosTutorEmpresarialComponent;
  let fixture: ComponentFixture<CriteriosTutorEmpresarialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriosTutorEmpresarialComponent]
    });
    fixture = TestBed.createComponent(CriteriosTutorEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
