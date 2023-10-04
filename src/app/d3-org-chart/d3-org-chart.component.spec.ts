import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3OrgChartComponent } from './d3-org-chart.component';

describe('D3OrgChartComponent', () => {
  let component: D3OrgChartComponent;
  let fixture: ComponentFixture<D3OrgChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [D3OrgChartComponent]
    });
    fixture = TestBed.createComponent(D3OrgChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
