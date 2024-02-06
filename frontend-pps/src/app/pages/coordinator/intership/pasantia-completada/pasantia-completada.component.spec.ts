import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasantiaCompletadaComponent } from './pasantia-completada.component';

describe('PasantiaCompletadaComponent', () => {
  let component: PasantiaCompletadaComponent;
  let fixture: ComponentFixture<PasantiaCompletadaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PasantiaCompletadaComponent]
    });
    fixture = TestBed.createComponent(PasantiaCompletadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
