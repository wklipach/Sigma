import { Component, ViewChild } from '@angular/core';
import { ChecklistService } from 'src/app/services/checklist.service';

import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { TableService } from 'src/app/services/table.service';
import { ITable } from 'src/app/interface/table';
import { Router } from '@angular/router';



interface IListCheck {
  id: number;
  id_object: number;
  name: string;
  address: string;
  DateBegin: Date; 
  DateEnd: Date; 
  average_grade: number; 
  count_trouble: number;
  id_check_senjor: number;
  fio: string; 
}



@Component({
  selector: 'app-list-check',
  templateUrl: './list-check.component.html',
  styleUrls: ['./list-check.component.css']
})
export class ListCheckComponent {

  ColumnMode = ColumnMode;
  @ViewChild('CheckListTable') datatableComponent!: DatatableComponent;
  faCoffee = faCoffee;
    //содержит ширины столбцов, взятые из хранилища
  ColumnSizeObj:  ITable[] = [];
  arrayListCheck:  IListCheck[] = [];

  constructor (private servcheck: ChecklistService, private tableServ:  TableService, private router: Router,) { }
    

  ngOnInit() {

    this.ColumnSizeObj =   this.tableServ.getTableWidth('CheckListTable');


    this.servcheck.getListCheck().subscribe( (value: any) => {
      
      let dirtyListCheck: IListCheck[]  = value; 

      dirtyListCheck.map( el => {

        const dBegin = new Date(el.DateBegin);
        dBegin.setMinutes(dBegin.getMinutes() - dBegin.getTimezoneOffset()) ;
        el.DateBegin = dBegin;

        const dEnd = new Date(el.DateEnd);
        dEnd.setMinutes(dEnd.getMinutes()-dEnd.getTimezoneOffset()) ;
        el.DateEnd = dEnd;

      });


      console.log('dirtyListCheck', dirtyListCheck);

      this.arrayListCheck = dirtyListCheck;

    });
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
        this.saveColumnSize(this.datatableComponent, 'CheckListTable', e.column.prop, e.newValue);
      }
  }


  openCheckObject(id_po_check: number) {

    const url = this.router.serializeUrl(this.router.createUrlTree(['checkcard'], {
      queryParams: {
        id_po_check: id_po_check,
      }
    }));

    const newTab = window.open(url, '_blank'); 
    if(newTab) {
        newTab.opener = null;
    }

  }

}

