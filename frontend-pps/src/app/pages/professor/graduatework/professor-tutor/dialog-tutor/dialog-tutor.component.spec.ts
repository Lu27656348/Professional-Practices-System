import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTutorComponent } from './dialog-tutor.component';

describe('DialogTutorComponent', () => {
  let component: DialogTutorComponent;
  let fixture: ComponentFixture<DialogTutorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DialogTutorComponent]
    });
    fixture = TestBed.createComponent(DialogTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
