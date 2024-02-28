import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriteriosJuradoEscritoComponent } from './criterios-jurado-escrito.component';

describe('CriteriosJuradoEscritoComponent', () => {
  let component: CriteriosJuradoEscritoComponent;
  let fixture: ComponentFixture<CriteriosJuradoEscritoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CriteriosJuradoEscritoComponent]
    });
    fixture = TestBed.createComponent(CriteriosJuradoEscritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
