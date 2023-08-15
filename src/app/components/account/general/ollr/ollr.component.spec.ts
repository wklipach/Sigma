import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OllrComponent } from './ollr.component';

describe('OllrComponent', () => {
  let component: OllrComponent;
  let fixture: ComponentFixture<OllrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OllrComponent]
    });
    fixture = TestBed.createComponent(OllrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
