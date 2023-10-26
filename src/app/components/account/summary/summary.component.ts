import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SummaryService } from 'src/app/services/summary.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { ITable } from 'src/app/interface/table';
import { TableService } from 'src/app/services/table.service';
import { SettingsService } from 'src/app/services/settings.service';



interface IShowRes { 
  Age?: string; 
  DateBirth?: Date; 
  fio?: string; 
  phone?: string; 
  phone2?: string; 
  position?: string; 
  status?: string; 
  typeperson?: string; 
  rank?: string;
};


interface IObjectSenjor  {
  id_object?: number; 
  PONAME?: string; 
  senjor?: string;
};

interface ICompany  {
  id_organization?: number; 
  name?: string; 
};

interface IOLLR  {
  ​​id_ollr?: string; 
  name?: string; 
  Color?: string; 
  DateBegin?: string; 
  ​​​​period?: string;  
  SerNo?: string; 
 };


 interface IProtectedObject {
  id?: number; 
  id_object?: number; 
  name_object?: string;
}





@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})

export class SummaryComponent  implements OnInit  {



  @Input()  id_staff: number = 0;

  ColumnMode = ColumnMode;
  @ViewChild('Staff2OllrTable') datatableComponent!: DatatableComponent;
  faCoffee = faCoffee;

  ShowRes: IShowRes = <IShowRes>{};
  ShowObjectSenjor: IObjectSenjor[] = [];
  ShowCompany: ICompany[] = [];
  ShowOLLR: IOLLR[] = [];

  //содержит ширины столбцов, взятые из хранилища
  ColumnSizeObj:  ITable[] = [];
  settingProtectedObject:  IProtectedObject = {};


  constructor(private route: ActivatedRoute, 
              private summaryServ: SummaryService, 
              private router: Router, 
              private tableServ:  TableService, 
              private settingserv: SettingsService,) { 
        // this.route.queryParams.subscribe((params) => { this.id_staff = params['id_staff'];
      //});
  }

  
   ngOnInit() {

    this.ColumnSizeObj =   this.tableServ.getTableWidth('Staff2OllrTable');

    this.summaryServ.getStaffOne(this.id_staff).subscribe ( (value: any) => {

      if (value?.[0] !== undefined) {
            this.ShowRes = {
                          Age:  value[0].Age,
                          DateBirth: value[0].DateBirth,
                          fio: value[0].fio,
                          phone: value[0].phone,
                          phone2: value[0].phone2,
                          position:value[0].position,
                          status: value[0].status,
                          typeperson: value[0].typeperson,
                          rank: value[0].rank
                        };
                      }
      });
    

    this.summaryServ.getObjectSenjor(this.id_staff).subscribe ( (value: any) => {
      this.ShowObjectSenjor = value;
    });

    this.summaryServ.getCompany(this.id_staff).subscribe ( (value: any) => {
      this.ShowCompany = value;
    });

    this.summaryServ.getCurrentOLLR(this.id_staff).subscribe ( (value: any) => {
      value.forEach ( (el: any) => {
        if (el.period.toString()=== "0") {
          el.period = "Бессрочно";
        }
       });

      this.ShowOLLR = value;
    });

    this.settingserv.getSettingProtectedObject(this.id_staff).subscribe ( (res: any) => {

      if (res && res.length>0) this.settingProtectedObject = res[0];  
    });

  }

  backStaff() {
    this.router.navigate(['staff2']);
  }


  getColumnSize(col_name: string) {

    let res: number = 150;
    let resFind = this.ColumnSizeObj.find( el => el.column_name == col_name);
      if (resFind) {
          res = Number(resFind.column_width);
      }
    return res;
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
      this.saveColumnSize(this.datatableComponent, 'Staff2OllrTable', e.column.prop, e.newValue);
    }
}



}
