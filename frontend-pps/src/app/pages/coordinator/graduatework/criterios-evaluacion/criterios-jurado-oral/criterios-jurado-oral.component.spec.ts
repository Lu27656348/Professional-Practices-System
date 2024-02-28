import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosJuradoOralComponent } from './criterios-jurado-oral.component';

describe('CriteriosJuradoOralComponent', () => {
  let component: CriteriosJuradoOralComponent;
  let fixture: ComponentFixture<CriteriosJuradoOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriosJuradoOralComponent]
    });
    fixture = TestBed.createComponent(CriteriosJuradoOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
