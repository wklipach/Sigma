import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropStaff2Component } from './drag-drop-staff2.component';

describe('DragDropStaff2Component', () => {
  let component: DragDropStaff2Component;
  let fixture: ComponentFixture<DragDropStaff2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DragDropStaff2Component]
    });
    fixture = TestBed.createComponent(DragDropStaff2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
