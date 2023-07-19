import { Component } from '@angular/core';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent {


  str1: string = "";
  str2: string = "";
  str3: string = "";


  ngOnInit() {
    this.clickWigth();
  }

  clickWigth() {
    const col1 = <HTMLTableCellElement>document.getElementById('col1');
    const col2 = <HTMLTableCellElement>document.getElementById('col2');
    const col3 = <HTMLTableCellElement>document.getElementById('col3');

    
    this.str1 = "Столбец1: "+col1.clientWidth;
    this.str2 = "Столбец2: "+col2.clientWidth;
    this.str3 = "Столбец3: "+col3.clientWidth;

    }

}
