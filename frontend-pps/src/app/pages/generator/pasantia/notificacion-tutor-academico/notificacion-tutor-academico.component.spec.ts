import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionTutorAcademicoComponent } from './notificacion-tutor-academico.component';

describe('NotificacionTutorAcademicoComponent', () => {
  let component: NotificacionTutorAcademicoComponent;
  let fixture: ComponentFixture<NotificacionTutorAcademicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificacionTutorAcademicoComponent]
    });
    fixture = TestBed.createComponent(NotificacionTutorAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
