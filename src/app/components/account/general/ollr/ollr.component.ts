import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { ITable } from 'src/app/interface/table';
import { GuideService } from 'src/app/services/guide.service';
import { TableService } from 'src/app/services/table.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { Observable, forkJoin } from 'rxjs';
import { OllrService } from 'src/app/services/ollr.service';


interface IOLLR  {
  id?: string; 
  id_staff?: string; 
  ​​id_ollr?: string; 
  gname?: string; 
  Color?: string; 
  DateBegin?: Date; 
  ​​​​period?: string;  
  bitClose?: string;  
 };


 
 interface IDeleteObject {
  id?: number;
  id_staff?: number;
  sLink?: string;
}


interface IOllrGuide { 
  id_ollr?: string;  
  name?: string; 
  period: number;
}



@Component({
  selector: 'app-ollr',
  templateUrl: './ollr.component.html',
  styleUrls: ['./ollr.component.css']
})
export class OllrComponent {

  id_staff: number = 0;
  ColumnSizeObj:  ITable[] = [];
  ShowOLLR: IOLLR[] = [];
  guideOllr:  IOllrGuide[] = [];
  ColumnMode = ColumnMode;
  @ViewChild('EditOllrTable') datatableComponent!: DatatableComponent;
  faCoffee = faCoffee;
  curDeleteObject: IDeleteObject = {};
  curCloseObject: IDeleteObject = {};
  settingOllr:  IOLLR = {};


  constructor(private route: ActivatedRoute,
    private router: Router,
    private servguide: GuideService, 
    private datePipe: DatePipe,
    private tableServ:  TableService,
    private servollr: OllrService) {

}



  ngOnInit(): void {


    this.ColumnSizeObj =   this.tableServ.getTableWidth('EditOllrTable');

    this.route.queryParams.subscribe( (params) => { 
      this.id_staff = params['id_staff'];
      this.loadData();
      console.log('this.id_staff', this.id_staff);
     });

 }


 loadData() {

  let sources: Observable<any>[] = [
    this.servguide.getOllrGuide(),
    this.servollr.getOllr(this.id_staff),
  ];

  forkJoin(sources)
  .subscribe( ([res1, res2]) => {
      this.guideOllr = res1; 
      this.ShowOLLR = res2; 
      console.log('this.ShowOLLR=', this.ShowOLLR);
      });    


 }


 saveColumnSize(table: DatatableComponent, storage_name: string, new_column: string, newValue: string) {
  let saveObj: ITable[] = [];
  table.bodyComponent.columns.forEach ( col => {
    if (col.prop && col.width) {
      if (col.prop == new_column) {
        saveObj.push({column_name: new_column, column_width: newValue});
      } else {
        saveObj.push({column_name: col.prop.toString(), column_width: col.width.toString()});
      }
    }
  });


  this.tableServ.setTableWidth(saveObj, storage_name);
} 


onResize(e: any) {
    if (e && e.column && e.column.prop && e.newValue) {
      this.saveColumnSize(this.datatableComponent, 'EditOllrTable', e.column.prop, e.newValue);
    }
}

getColumnSize(col_name: string) {

  let res: number = 150;
  let resFind = this.ColumnSizeObj.find( el => el.column_name == col_name);
    if (resFind) {
        res = Number(resFind.column_width);
    }
  return res;
}
 // $(cur_tr).css("background", "#ff0000");


/// ВСЕ СВЯЗАННОЕ C DELETE 
 deleteOllr(id_staff: number, id: number, sLink: string) {
  this.curDeleteObject.sLink = sLink;
  this.curDeleteObject.id = id;
  this.curDeleteObject.id_staff = id_staff;
  document!.getElementById("openDeleteModalButton")!.click();
 }

deleteClose() {
  document!.getElementById("closeDeleteModalButton")!.click();
}
  
deleteSave() {

  if (this.curDeleteObject.id && this.curDeleteObject.id_staff)  {

    let id = this.curDeleteObject.id;
    let idStaff = this.curDeleteObject.id_staff;

    let indexShowOLLR = this.ShowOLLR.findIndex( (el  =>  el.id == id.toString()   ));
    this.ShowOLLR.splice(indexShowOLLR,1);

    //refresh data
    this.ShowOLLR = [...this.ShowOLLR];

    this.servollr.deleteOllr(idStaff , id).subscribe();
  }

  this.deleteClose();
}

/// END СВЯЗАННОЕ C DELETE 


/// ВСЕ СВЯЗАННОЕ C CLOSE
closeOllr(id_staff: number, id: number, sLink: string) {
  this.curCloseObject.sLink = sLink;
  this.curCloseObject.id = id;
  this.curCloseObject.id_staff = id_staff;
  document!.getElementById("openCloseModalButton")!.click();
 }

closeClose() {
  document!.getElementById("closeCloseModalButton")!.click();
}
  
closeSave() {

  if (this.curCloseObject.id && this.curCloseObject.id_staff)  {

    let id = this.curCloseObject.id;
    let idStaff = this.curCloseObject.id_staff;

    let indexShowOLLR = this.ShowOLLR.findIndex( (el  =>  el.id == id.toString()   ));
    this.ShowOLLR[indexShowOLLR].Color="crossed_out";

    //refresh data
    this.ShowOLLR = [...this.ShowOLLR];

    this.servollr.closeOllr(idStaff , id).subscribe();
  }

  this.closeClose();
}

/// END СВЯЗАННОЕ C CLOSE


idDateisValid (date: Date) {
  return date.getTime() === date.getTime();
} 

addDateBegin(e: any) {
  let date = new Date(e.target.value);
  const isDate = this.idDateisValid(date);
  if (isDate) {
      this.settingOllr.DateBegin = date;
  }
}

addDoc() {

  document!.getElementById("openAddModalButton")!.click();

}


addClose() {
  document!.getElementById("closeAddModalButton")!.click();
}

addSave() {


  if (!this.settingOllr) {
    alert('Введите документ и дату.');
    this.addClose();
    return;
  } 

  if (!this.settingOllr.gname) {
    alert('Введите документ.');
    this.addClose();
    return;
  } 

  if (!this.settingOllr.DateBegin) {
    alert('Введите дату.');
    this.addClose();
    return;
  } 
  
  if (!this.idDateisValid(this.settingOllr.DateBegin)) {
    alert('Введите дату.');
    this.addClose();
    return;
  } 


  let indexOLLR = this.guideOllr.findIndex( (el  =>  el.name == this.settingOllr.gname));
  this.settingOllr.id_ollr = this.guideOllr[indexOLLR].id_ollr;
  this.settingOllr.id_staff = this.id_staff.toString();

  if (!this.settingOllr.id_ollr) {
    alert('Такой тип документа не найден в базе.');
    return;
  }

  console.log(this.settingOllr);  


  this.servollr.addOllr(this.settingOllr.id_staff, this.settingOllr.id_ollr, this.settingOllr.DateBegin).subscribe ( res => {
    this.loadData();
  });
  
    //


  this.addClose();


}


backGeneral() {
  this.router.navigate(['general'], { queryParams: { id_staff: this.id_staff }});
}


 
getRowClass(row: any) {

  if (row.Color === "red") {
    console.log('row red=', row);
    return {
      'row-red-color': true
    };
  }

  if (row.Color == "green") {
    console.log('row green=', row);
    return {
      'row-green-color': true
    };
  }

  if (row.Color == "gray") {
    console.log('row gray=', row);
    return {
      'row-gray-color': true
    };
  }

  if (row.Color == "crossed_out") {
    console.log('row crossed_out=', row);
    return {
      'row-crossedout': true
    };
  }

  console.log('row empty=', row);
  return {};


  }


}
