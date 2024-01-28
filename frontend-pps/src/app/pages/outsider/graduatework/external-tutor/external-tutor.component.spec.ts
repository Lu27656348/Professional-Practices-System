import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalTutorComponent } from './external-tutor.component';

describe('ExternalTutorComponent', () => {
  let component: ExternalTutorComponent;
  let fixture: ComponentFixture<ExternalTutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalTutorComponent]
    });
    fixture = TestBed.createComponent(ExternalTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
