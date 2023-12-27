import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitaryserviceComponent } from './communitaryservice.component';

describe('CommunitaryserviceComponent', () => {
  let component: CommunitaryserviceComponent;
  let fixture: ComponentFixture<CommunitaryserviceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommunitaryserviceComponent]
    });
    fixture = TestBed.createComponent(CommunitaryserviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
