import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropuestaPasantiaComponent } from './propuesta-pasantia.component';

describe('PropuestaPasantiaComponent', () => {
  let component: PropuestaPasantiaComponent;
  let fixture: ComponentFixture<PropuestaPasantiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PropuestaPasantiaComponent]
    });
    fixture = TestBed.createComponent(PropuestaPasantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
