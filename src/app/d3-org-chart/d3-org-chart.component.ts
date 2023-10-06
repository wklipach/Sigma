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
      .nodeWidth( () => 160)
      .nodeHeight( () => 160)
      .nodeContent( (node: any, i: any, arr: any, state: any) => {

/*        
        return "<div style='"+mSt+ "'>"+node.data.name +"</div>"+
               "<img tree_id='"+ node.data.id +"' class='rounded image-input-wrapper w-125px h-125px'"+" src='"+ node.data.photo_name +"'>"+
               "<div>"+node.data.address +"</div>"+
               "<div>"+node.data.rank +"</div>";
*/

const color = '#FFFFFF';

return    `
         <div draggable="true" tree_id=${node.data.id}
             style="font-family: 'Inter', sans-serif;background-color:${color}; position:absolute;margin-top:-1px; margin-left:-1px;width:${node.width}px;height:${node.height}px;border-radius:10px;border: 1px solid #E4E2E9">
            <div style="background-color:${color};position:absolute;margin-top:-25px;margin-left:${15}px;border-radius:100px;width:50px;height:50px;" ></div>
            <img draggable="false" src=" ${
              node.data.photo_name
            }" style="position:absolute;margin-top:-20px;margin-left:${20}px;border-radius:100px;width:40px;height:40px;" />
            
            <div style="color:#08011E;position:absolute;right:20px;top:17px;font-size:10px;"><i class="fas fa-ellipsis-h"></i></div>

            <div style="font-size:15px;color:#08011E;margin-left:20px;margin-top:32px"> ${
              node.data.name
            } </div>
            <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> ${
              node.data.address
            } </div>

            <div style="color:#716E7B;margin-left:20px;margin-top:3px;font-size:10px;"> ${
              node.data.rank
            } </div>

          </div>
          `;


      })
      .render();
  }

  dragStart(event: any) {
    console.log('dragStart');
  }


}
