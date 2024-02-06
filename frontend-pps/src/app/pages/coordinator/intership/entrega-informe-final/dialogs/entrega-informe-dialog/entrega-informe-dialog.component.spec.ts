import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaInformeDialogComponent } from './entrega-informe-dialog.component';

describe('EntregaInformeDialogComponent', () => {
  let component: EntregaInformeDialogComponent;
  let fixture: ComponentFixture<EntregaInformeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EntregaInformeDialogComponent]
    });
    fixture = TestBed.createComponent(EntregaInformeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
