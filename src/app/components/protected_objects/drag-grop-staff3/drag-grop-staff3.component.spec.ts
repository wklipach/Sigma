import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragGropStaff3Component } from './drag-grop-staff3.component';

describe('DragGropStaff3Component', () => {
  let component: DragGropStaff3Component;
  let fixture: ComponentFixture<DragGropStaff3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragGropStaff3Component]
    });
    fixture = TestBed.createComponent(DragGropStaff3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
