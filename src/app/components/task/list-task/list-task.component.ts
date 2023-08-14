import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { TaskService } from 'src/app/services/task.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ITable } from 'src/app/interface/table';
import { TableService } from 'src/app/services/table.service';



interface ITask {
id_task? : string, 
id_department? : string,   
note? : string,  
department_name? : string, 
date_begin? : string, 
date_end? : string, 
bitSuccess? : boolean;
Success?: string;
RESFIO? : string;
name_task? : string; 
Acceptor? : string; 
bitAccept? : string; 
}

interface IDeleteTask {
  id_task?: number;
  sLink?: string;
}

interface ISuccesfullTask {
  id_task?: number;
  sLink?: string;
}


@Component({
  selector: 'app-list-task',
  templateUrl: './list-task.component.html',
  styleUrls: ['./list-task.component.css']
})
export class ListTaskComponent {


  taskArray: ITask[] = []; 
  taskOriginal: ITask[] = []; 
  checkboxFlagUnsucc: boolean = true;
  checkboxFlagSucc: boolean = true;

  ColumnMode = ColumnMode;
  @ViewChild('TaskTable') datatableComponent!: DatatableComponent;

  //содержит ширины столбцов, взятые из хранилища
  ColumnSizeObj:  ITable[] = [];
  //объект для модального окна удаления
  curDeleteTask: IDeleteTask = {};
  curSuccesfullTask: ISuccesfullTask = {};
  curAcceptTask: ISuccesfullTask = {};



  constructor(private servTask: TaskService,
                      private datePipe: DatePipe,
                      private router: Router,
                      private tableServ:  TableService,
                      public gr: GlobalRef) {    
  }

  ngOnInit() {

    this.ColumnSizeObj =   this.tableServ.getTableWidth('TaskTable');


    this.servTask.getTask_All().subscribe( (value: any) => {
      this.taskArray = value; 


      this.taskArray.forEach ( el => {

        if (el.bitSuccess)  el.Success = "Да"; else el.Success = "Нет"
      });


      this.taskOriginal = [...this.taskArray]


      console.log(this.taskArray);

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
      this.saveColumnSize(this.datatableComponent, 'TaskTable', e.column.prop, e.newValue);
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


  succesfullTask(id_task: number, sLink: string) {
    //openSuccesfullCloseModalButton
    this.curSuccesfullTask.sLink = sLink;
    this.curSuccesfullTask.id_task = id_task;
    document!.getElementById("openSuccesfullModalButton")!.click();
  }



  acceptTask(id_task: number, sLink: string) {
    this.curAcceptTask.sLink = sLink;
    this.curAcceptTask.id_task = id_task;
    console.log('s1');
    document!.getElementById("openAcceptModalButton")!.click();
  }


  succesfullClose() {
    document!.getElementById("closeSuccesfullModalButton")!.click();
  }

  acceptClose() {
    document!.getElementById("closeAcceptModalButton")!.click();
  }

    
  succesfullSave() {

    if (this.curSuccesfullTask.id_task) {

      let idTask = this.curSuccesfullTask.id_task;

      let indexShowTask = this.taskArray.findIndex( (el  =>  el.id_task == idTask.toString()));
      this.taskArray[indexShowTask].bitSuccess = true;
      let indexShowOriginal = this.taskOriginal.findIndex( (el  =>  el.id_task == idTask.toString()));
      this.taskOriginal[indexShowOriginal].bitSuccess = true;

      //refresh data
      this.taskOriginal = [...this.taskOriginal];
      this.taskArray = [...this.taskArray];
      //меняем в базе  
      this.servTask.succesfullTask(idTask.toString()).subscribe();
    }
    this.succesfullClose();
  }


  acceptSave() {

    if (this.curAcceptTask.id_task) {

      let idTask = this.curAcceptTask.id_task;
      this.servTask.acceptTask(idTask.toString()).subscribe( (res: any) => {

        console.log(res, res[0].RES);

        let indexShowTask = this.taskArray.findIndex( (el  =>  el.id_task == idTask.toString()));
        this.taskArray[indexShowTask].bitAccept = '1';
        this.taskArray[indexShowTask].Acceptor = res[0].RES;
        let indexShowOriginal = this.taskOriginal.findIndex( (el  =>  el.id_task == idTask.toString()));
        this.taskOriginal[indexShowOriginal].bitAccept = '1';
        this.taskOriginal[indexShowOriginal].Acceptor = res[0].RES;
  
        //refresh data
        this.taskOriginal = [...this.taskOriginal];
        this.taskArray = [...this.taskArray];

        console.log(this.taskArray);
  

      });

    }
    this.acceptClose();
  }



  deleteTask(id_task: number, sLink: string) {
    //openDeleteModalButton
    this.curDeleteTask.sLink = sLink;
    this.curDeleteTask.id_task = id_task;
    document!.getElementById("openDeleteModalButton")!.click();
  }


  deleteClose() {
    document!.getElementById("closeDeleteModalButton")!.click();
  }
    
  deleteSave() {

    if (this.curDeleteTask.id_task) {

      let idTask = this.curDeleteTask.id_task;

      let indexShowTask = this.taskArray.findIndex( (el  =>  el.id_task == idTask.toString()));
      this.taskArray.splice(indexShowTask,1);

      let indexShowOriginal = this.taskOriginal.findIndex( (el  =>  el.id_task == idTask.toString()));
      this.taskOriginal.splice(indexShowOriginal,1);

      //refresh data
      this.taskOriginal = [...this.taskOriginal];
      this.taskArray = [...this.taskArray];

      this.servTask.deleteTask(idTask.toString()).subscribe();
    }
    this.deleteClose();
  }



  onChangeSuccUsucc(sChecker: string) {
    // console.log('checkboxFlagUnsucc=', this.checkboxFlagUnsucc, 'checkboxFlagSucc=', this.checkboxFlagSucc);
    this.updateFilter(sChecker);
  }


  updateFilter(sChecker: string) {

    // если оба флага выключены включаем противополжный
    if (!this.checkboxFlagUnsucc && !this.checkboxFlagSucc) {
      if (sChecker == "checkboxFlagUnsucc") this.checkboxFlagSucc = true;
      if (sChecker == "checkboxFlagSucc") this.checkboxFlagUnsucc = true;
    }

    //оба включены
    if (this.checkboxFlagUnsucc && this.checkboxFlagSucc) {
      this.taskArray = [...this.taskOriginal];
    }

    //показываем невыполненные
    if (this.checkboxFlagUnsucc && !this.checkboxFlagSucc) {

      const temp = this.taskOriginal.filter(function (d) {
        return d.bitSuccess == false;
      });
      this.taskArray = [...temp];

    }
    
    //показываем выполненные
    if (!this.checkboxFlagUnsucc && this.checkboxFlagSucc) {

      const temp = this.taskOriginal.filter(function (d) {
        return d.bitSuccess == true;
      });
      this.taskArray = [...temp];
      
    }
  }

}
