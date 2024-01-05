import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefenseComponent } from './defense.component';

describe('DefenseComponent', () => {
  let component: DefenseComponent;
  let fixture: ComponentFixture<DefenseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefenseComponent]
    });
    fixture = TestBed.createComponent(DefenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
