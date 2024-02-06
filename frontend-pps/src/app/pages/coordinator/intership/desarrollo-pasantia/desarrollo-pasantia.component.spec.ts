import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesarrolloPasantiaComponent } from './desarrollo-pasantia.component';

describe('DesarrolloPasantiaComponent', () => {
  let component: DesarrolloPasantiaComponent;
  let fixture: ComponentFixture<DesarrolloPasantiaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesarrolloPasantiaComponent]
    });
    fixture = TestBed.createComponent(DesarrolloPasantiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
