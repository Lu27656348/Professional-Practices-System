import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorGWComponent } from './professor-gw.component';

describe('ProfessorGWComponent', () => {
  let component: ProfessorGWComponent;
  let fixture: ComponentFixture<ProfessorGWComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfessorGWComponent]
    });
    fixture = TestBed.createComponent(ProfessorGWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
