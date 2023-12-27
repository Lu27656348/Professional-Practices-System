import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateworkComponent } from './graduatework.component';

describe('GraduateworkComponent', () => {
  let component: GraduateworkComponent;
  let fixture: ComponentFixture<GraduateworkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GraduateworkComponent]
    });
    fixture = TestBed.createComponent(GraduateworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
