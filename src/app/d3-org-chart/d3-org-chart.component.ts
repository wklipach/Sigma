import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { OrgChart } from 'd3-org-chart';


@Component({
  selector: 'app-d3-org-chart',
  templateUrl: './d3-org-chart.component.html',
  styleUrls: ['./d3-org-chart.component.css']
})
export class D3OrgChartComponent {

  @ViewChild('chartContainer') chartContainer: ElementRef | undefined;
  @Input() data: any[] | undefined;
  chart: any;

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    if (!this.chart) {
      this.chart = new OrgChart();
    }
    this.updateChart();
  }

  ngOnChanges() {
    this.updateChart();
  }
  updateChart() {
    if (!this.data) {
      return;
    }

    if (!this.chart) {
      return;
      
    }

    if (!this.chartContainer) {
      return;
    }



    let mSt ="background-color: blue"; 

    this.chart
      .container(this.chartContainer.nativeElement)
      .data(this.data)
      .nodeWidth( () => 120)
      .nodeHeight( () => 160)
      .nodeContent( (node: any, i: any, arr: any, state: any) => {

        return "<div style='"+mSt+ "'>"+node.data.name +"</div>"+
               "<div>"+ i +"</div>"+
               "<img tree_id='"+ node.data.id +"' class='rounded image-input-wrapper w-125px h-125px'"+" src='"+node.data.profileUrl+"'>";
      })
      .render();
  }


 

}
