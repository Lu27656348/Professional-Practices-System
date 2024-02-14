import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesarrolloTGComponent } from './desarrollo-tg.component';

describe('DesarrolloTGComponent', () => {
  let component: DesarrolloTGComponent;
  let fixture: ComponentFixture<DesarrolloTGComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DesarrolloTGComponent]
    });
    fixture = TestBed.createComponent(DesarrolloTGComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
