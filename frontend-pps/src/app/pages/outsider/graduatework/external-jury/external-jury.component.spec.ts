import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalJuryComponent } from './external-jury.component';

describe('ExternalJuryComponent', () => {
  let component: ExternalJuryComponent;
  let fixture: ComponentFixture<ExternalJuryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalJuryComponent]
    });
    fixture = TestBed.createComponent(ExternalJuryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
