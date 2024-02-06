import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionTutorEmpresarialComponent } from './notificacion-tutor-empresarial.component';

describe('NotificacionTutorEmpresarialComponent', () => {
  let component: NotificacionTutorEmpresarialComponent;
  let fixture: ComponentFixture<NotificacionTutorEmpresarialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificacionTutorEmpresarialComponent]
    });
    fixture = TestBed.createComponent(NotificacionTutorEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
