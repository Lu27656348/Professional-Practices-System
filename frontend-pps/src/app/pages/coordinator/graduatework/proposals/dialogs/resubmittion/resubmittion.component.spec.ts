import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResubmittionComponent } from './resubmittion.component';

describe('ResubmittionComponent', () => {
  let component: ResubmittionComponent;
  let fixture: ComponentFixture<ResubmittionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResubmittionComponent]
    });
    fixture = TestBed.createComponent(ResubmittionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
