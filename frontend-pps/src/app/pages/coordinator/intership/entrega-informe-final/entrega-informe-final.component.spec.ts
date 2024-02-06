import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaInformeFinalComponent } from './entrega-informe-final.component';

describe('EntregaInformeFinalComponent', () => {
  let component: EntregaInformeFinalComponent;
  let fixture: ComponentFixture<EntregaInformeFinalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntregaInformeFinalComponent]
    });
    fixture = TestBed.createComponent(EntregaInformeFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
