import { Component, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { ITable } from 'src/app/interface/table';
import { TableService } from 'src/app/services/table.service';
import { GlobalRef } from 'globalref';
import { GuideService } from 'src/app/services/guide.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TabelService } from 'src/app/services/tabel.service';
import { Observable, forkJoin } from 'rxjs';
import { SettingsService } from 'src/app/services/settings.service';


interface ITabel {
  id?: number;
  id_staff?: number;
  fio?: string;
  id_object?: number;
  object_name: string;
  DateBegin: Date;
  DateBegin_str: string;
  DateEnd: Date;
  DateEnd_str: string;
}

interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

@Component({
  selector: 'app-tabel',
  templateUrl: './tabel.component.html',
  styleUrls: ['./tabel.component.css']
})
export class TabelComponent {

  ColumnMode = ColumnMode;
  @ViewChild('tabelTable') datatableComponent!: DatatableComponent;
  faCoffee = faCoffee;

  ShowTabel_original: ITabel[] = [];
  ShowTabel: ITabel[] = [];
  guideProtectedObject:  ISmallGuide[] = [];

  //содержит ширины столбцов, взятые из хранилища
  ColumnSizeObj:  ITable[] = [];
  // для работы таблицы
  editing: any = {};


  constructor ( private servguide: GuideService, 
                private datePipe: DatePipe,
                private router: Router,
                private tableServ:  TableService,
                private tabelsrv: TabelService,
                private settingserv: SettingsService,
                private gr: GlobalRef ) {  }      


                ngOnInit() {
                      this.ColumnSizeObj =   this.tableServ.getTableWidth('tabelTable');


/*                      
                    this.tabelsrv.getTabel_All().subscribe( (res: any) => {
                            this.ShowTabel_original = res;
                            this.ShowTabel_original.forEach((el)=>  {
                              el.DateBegin_str = this.datePipe.transform(el.DateBegin, 'yyyy-MM-dd') || '';
                              el.DateEnd_str = this.datePipe.transform(el.DateEnd, 'yyyy-MM-dd') || '';
                          });
                          this.ShowTabel = [...this.ShowTabel_original];

                    });
*/                    

                    let sources: Observable<any>[] = [
                      this.tabelsrv.getTabel_All(),
                      this.servguide.getProtectedObjectGuide()
                    ];

                    forkJoin(sources)
                    .subscribe(([res1, res2]) => {
                        this.ShowTabel_original = res1;
                        this.ShowTabel_original.forEach((el)=>  {
                          el.DateBegin_str = this.datePipe.transform(el.DateBegin, 'yyyy-MM-dd') || '';
                          el.DateEnd_str = this.datePipe.transform(el.DateEnd, 'yyyy-MM-dd') || '';
                        });
                        this.ShowTabel = [...this.ShowTabel_original];

                        this.guideProtectedObject = res2;

                    });
               }




               onChangeProtectedObject(ev: any, smallGuide:  ISmallGuide[], id: number, id_staff: number) {

                let rowShowTable = this.ShowTabel.find ( curRow => curRow.id === id);
                let rowShowTableOriginal = this.ShowTabel_original.find ( curRow => curRow.id === id);
           
                if (ev) {
                  let res = smallGuide.find( (el) => el.name == ev.target.value);
                  if (res) {
                  if (!res.name) res.name='';
                  console.log(res, id);
            
                    if (res.id == '1') {
                      const id_object = rowShowTable?.id_object;
                      this.settingserv.setSettingDeleteProtectedObject(id, id_object || 0, id_staff).subscribe();

                      // обновляем массивы
                      if (rowShowTable) {rowShowTable.id_object = 1; rowShowTable.object_name = res.name; }
                      if (rowShowTableOriginal) {rowShowTableOriginal.id_object = 1; rowShowTableOriginal.object_name = res.name; }
                      return;
                    }
            
                    if (id == 0) {
                      console.log('добавляем');
                      this.settingserv.setInsertProtectedObject(res.id || '0', id_staff).subscribe();

                      // обновляем массивы
                      if (rowShowTable) {rowShowTable.id_object = Number(res.id); rowShowTable.object_name = res.name; }
                      if (rowShowTableOriginal) {rowShowTableOriginal.id_object = Number(res.id); rowShowTableOriginal.object_name = res.name; }
                      return;
                    }
            
                    if (id > 0) {
                      console.log('апдейтим');
                      this.settingserv.setUpdateProtectedObject(id, res.id || '0', id_staff).subscribe();

                      // обновляем массивы                      
                      if (rowShowTable) {rowShowTable.id_object = Number(res.id); rowShowTable.object_name = res.name; }
                      if (rowShowTableOriginal) {rowShowTableOriginal.id_object = Number(res.id); rowShowTableOriginal.object_name = res.name; }
                      return;
                    }
            
                  }
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
                    this.saveColumnSize(this.datatableComponent, 'tabelTable', e.column.prop, e.newValue);
                  }
              }                



              focusFunction(e: any, datestr: any) {
                e.target.type = 'date';
                console.log('datestr', datestr);
                e.target.value =  datestr;
              }

              myEnter(event: Event) {

                if (event.target) {
                  const elem = <HTMLElement>event.target;
                  if (elem) elem.blur();
                }
              }
              
              idDateisValid (date: Date) {
                return date.getTime() === date.getTime();
              }               
            
  
    setDateBegin($event: any, id: number) {
          let date = new Date($event.target.value);
          const isDate = this.idDateisValid(date);
          if (isDate) {
            // console.log($event.target.value, date);
            this.tabelsrv.setTabelDateBegin(date, id).subscribe( (res: any) => { console.log('res update = ', res); } );
          } else {
            this.tabelsrv.setTabelDateBeginNull(id).subscribe( (res: any) => { console.log('res update = ', res); } );
          }


          // обновляем показываемую таблицу
          const res = this.ShowTabel.map( el => {
            if (el.id?.toString() == id.toString()) {
              el.DateBegin_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
            }
            return el;
          });
          this.ShowTabel = [...res];


          // обновляем эталонную таблицу таблицу
          const resOriginal = this.ShowTabel_original.map( el => {
            if (el.id?.toString() == id.toString()) {
              el.DateBegin_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
            }
            return el;
          });
          this.ShowTabel_original = [...resOriginal];



          $event.target.type = '';
          return $event.target; 
    } 


    setDateEnd($event: any, id: number) {
      let date = new Date($event.target.value);
      const isDate = this.idDateisValid(date);
      if (isDate) {
        // console.log($event.target.value, date);
        this.tabelsrv.setTabelDateEnd(date, id).subscribe( (res: any) => { console.log('res update = ', res); } );
      } else {
        this.tabelsrv.setTabelDateEndNull(id).subscribe( (res: any) => { console.log('res update = ', res); } );
      }


      // обновляем показываемую таблицу
      const res = this.ShowTabel.map( el => {
        if (el.id?.toString() == id.toString()) {
          el.DateEnd_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
        }
        return el;
        });
      this.ShowTabel = [...res];

      // обновляем эталонную таблицу таблицу
      const resOriginal = this.ShowTabel_original.map( el => {
        if (el.id?.toString() == id.toString()) {
          el.DateEnd_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
         }
         return el;
        });
       this.ShowTabel_original = [...resOriginal];


      $event.target.type = '';
      return $event.target; 
} 


myalert(e: any) {
    console.log('e=', e);
}


onEnterSearch() {
  this.funcSearch();
 }
   
   

 funcSearch() {
  let sInput = (document.getElementById('search') as HTMLInputElement).value.toString().trim().toUpperCase();

  if (sInput) {
      // console.log('ищем=',sInput);
      
      const res = this.ShowTabel_original.filter( (el) => {
         return (el.id_staff &&  el.id_staff.toString().toUpperCase().indexOf(sInput) != -1) ||
                (el.fio &&  el.fio.toUpperCase().indexOf(sInput) != -1) ||
                (el.object_name &&  el.object_name.toUpperCase().indexOf(sInput) != -1);
      });

      // console.log('find=', res)
      this.ShowTabel =  [...res];

    } else {
      console.log('обнуляем поиск');
      // показываем без всяких ограничений
      this.ShowTabel = [...this.ShowTabel_original]; 
    }   



 }




}
