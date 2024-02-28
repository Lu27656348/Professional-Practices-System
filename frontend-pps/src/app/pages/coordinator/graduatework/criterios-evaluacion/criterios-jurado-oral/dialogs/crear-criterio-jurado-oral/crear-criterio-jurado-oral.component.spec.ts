import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCriterioJuradoOralComponent } from './crear-criterio-jurado-oral.component';

describe('CrearCriterioJuradoOralComponent', () => {
  let component: CrearCriterioJuradoOralComponent;
  let fixture: ComponentFixture<CrearCriterioJuradoOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCriterioJuradoOralComponent]
    });
    fixture = TestBed.createComponent(CrearCriterioJuradoOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
