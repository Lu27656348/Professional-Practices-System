import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCouncilComponent } from './dialog-council.component';

describe('DialogCouncilComponent', () => {
  let component: DialogCouncilComponent;
  let fixture: ComponentFixture<DialogCouncilComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogCouncilComponent]
    });
    fixture = TestBed.createComponent(DialogCouncilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
