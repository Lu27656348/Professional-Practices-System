import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearSeccionJuradoOralComponent } from './crear-seccion-jurado-oral.component';

describe('CrearSeccionJuradoOralComponent', () => {
  let component: CrearSeccionJuradoOralComponent;
  let fixture: ComponentFixture<CrearSeccionJuradoOralComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearSeccionJuradoOralComponent]
    });
    fixture = TestBed.createComponent(CrearSeccionJuradoOralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
