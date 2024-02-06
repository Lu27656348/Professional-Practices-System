import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComiteCatalogComponent } from './comite-catalog.component';

describe('ComiteCatalogComponent', () => {
  let component: ComiteCatalogComponent;
  let fixture: ComponentFixture<ComiteCatalogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComiteCatalogComponent]
    });
    fixture = TestBed.createComponent(ComiteCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
