import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralFilesComponent } from './general-files.component';

describe('GeneralFilesComponent', () => {
  let component: GeneralFilesComponent;
  let fixture: ComponentFixture<GeneralFilesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralFilesComponent]
    });
    fixture = TestBed.createComponent(GeneralFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
