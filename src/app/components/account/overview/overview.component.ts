import { Component, Renderer2 } from '@angular/core';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {


  str1: string = "";
  str2: string = "";
  str3: string = "";
  col3w: number = 25;
  width: number = 50;


  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // this.clickWigth();
  }


  ngAfterViewInit() {
    const htmlElem = document.getElementById("col2")!;
    const resizeObserver = new ResizeObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.contentBoxSize) {
            // contentBoxSize is an array:
            console.log("entry.contentBoxSize: " + entry.contentBoxSize[0].inlineSize)
          } else {
            console.log("entry.contentRect: " + entry.contentRect.width)
          }
        }
      }
    )
    resizeObserver.observe(htmlElem);
    
  }

  clickWigth() {


    const col1 = <HTMLTableCellElement>document.getElementById('col1');
    const col2 = <HTMLTableCellElement>document.getElementById('col2');
    const col3 = <HTMLTableCellElement>document.getElementById('col3');

   
    this.str1 = "Столбец1: "+col1.clientWidth;
    this.str2 = "Столбец2: "+col2.clientWidth;
    this.str3 = "Столбец3: "+col3.clientWidth;



    this.width = col3.clientWidth;


    this.renderer.setStyle(col1, "width", `${col3.clientWidth}px`);

        console.log('! 1:', col1.clientWidth);

    }


    col2resize(r: any) {

      console.log(r);
    }


}

