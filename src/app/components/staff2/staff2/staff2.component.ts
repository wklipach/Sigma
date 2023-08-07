import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {  CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GuideService } from 'src/app/services/guide.service';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FiltersService } from 'src/app/services/filters.service';
import { TableService } from 'src/app/services/table.service';
import { ITable } from 'src/app/interface/table';

//import {NgxDatatableResizer} from "@swimlane/model/Ngx-datatable-resizer";



interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface ISenjorGuardGuide { 
  id?: string;  
  id_staff?: string;  
  fio?: string; 
}


interface IFilter { 
  id?: string;  
  name?: string;  
  dateBegin?: string;  
  dateEnd?: string;  
  field1?: string;  
  field2?: string;  
  value1?: string;   
  value2?: string;  
}




interface IObjectOne { 
    id_staff?: string;  
    fio?: string;  
    phone?: string;  
    phone2?: string;  
    id_position?: string;  
    guide_position?: string;  
    id_status?: string;  
    guide_status?: string;  
    id_gender?: string;  
    guide_gender?: string;  
    id_typeperson?: string;   
    guide_typeperson?: string;  
    DateBirth?: string;  
    sAge?: string;  
    DateBirth_str?: string;  
    s002from?: string;  
    s002from_str?: string;  
    s003from?: string;  
    s003from_str?: string;  
    rank?: string;  
    id_senjor_guard?: string;  
    senjor_guard?: string;  
    id_organization?: string;
    organization?: string;
    DateCreation?: string;
    
    date_interview?: string;
    date_interview_str?: string;  
    id_sms?: string;
    guide_sms?: string;
    Color?: string;
}

interface IDeleteObject {
  id_staff?: number;
  sLink?: string;
}


@Component({
  selector: 'app-staff2',
  templateUrl: './staff2.component.html',
  styleUrls: ['./staff2.component.css']
})
export class Staff2Component {


  ColumnMode = ColumnMode;
  @ViewChild('Staff2Table') datatableComponent!: DatatableComponent;

  faCoffee = faCoffee;

  temp_var: string = "<a href='#' class='badge badge-primary'>Primary</a>'";



    //содержит ширины столбцов, взятые из хранилища
    ColumnSizeObj:  ITable[] = [];

    // то что показывается в таблице - ограниченно строкой поиска
    ShowStaff: IObjectOne[] = [];
    // все что скачано с сервера
    ORIGINAL_ShowStaff: IObjectOne[] = [];

    guidePosition:  ISmallGuide[] = [];
    guideStatus:  ISmallGuide[] = [];
    guideOrganization:  ISmallGuide[] = [];
    guideGender:  ISmallGuide[] = [];
    guideTypeperson:  ISmallGuide[] = [];
    guideSMS:  ISmallGuide[] = [];
    guideSenjorGuard:  ISenjorGuardGuide[] = [];
    //объект для модального окна удаления
    curDeleteObject: IDeleteObject = {};

    // фильтры
    listFilters:  any[] = [];


    // для работы таблицы
    editing: any = {};

  constructor (private staffserv: StaffService, 
    private servguide: GuideService, 
    private datePipe: DatePipe,
    private router: Router,
    private servfilter: FiltersService,
    private tableServ:  TableService ) {  }


ngOnInit() {

  this.ColumnSizeObj =   this.tableServ.getTableWidth('staff2table');

  
  this.servguide.getSmallGuide('guide_position').subscribe( (value: any) => {
    this.guidePosition = value; 
  });

  
  this.servguide.getSmallGuide('guide_organization').subscribe( (value: any) => {
    this.guideOrganization = value; 
  });



  this.servguide.getSmallGuide('guide_status').subscribe( (value: any) => {
    this.guideStatus = value; 
  });


  this.servguide.getSmallGuide('guide_gender').subscribe( (value: any) => {
    this.guideGender = value; 
  });

  this.servguide.getSmallGuide('guide_typeperson').subscribe( (value: any) => {
    this.guideTypeperson = value; 
  });

  this.servguide.getSmallGuide('guide_sms').subscribe( (value: any) => {
    this.guideSMS = value; 
  });

  this.servguide.getSenjorGuard().subscribe( (value: any) => {
    this.guideSenjorGuard = value; 
    //console.log('guideSenjorGuard', this.guideSenjorGuard);
  });



  this.staffserv.getStaff_All().subscribe ( (value: any) => {


    console.log('res=', value);

    this.ORIGINAL_ShowStaff = value;

    this.ORIGINAL_ShowStaff.forEach((el)=>  {

      el.DateBirth_str = this.datePipe.transform(el.DateBirth, 'yyyy-MM-dd') || '--';
      el.s002from_str = this.datePipe.transform(el.s002from, 'yyyy-MM-dd') || '--';
      el.s003from_str = this.datePipe.transform(el.s003from, 'yyyy-MM-dd') || '--';
      el.date_interview_str = this.datePipe.transform(el.date_interview, 'yyyy-MM-dd') || '--';

      if (el.fio?.trim() === "" || el.fio?.trim() == null ) el.fio = "--" ; 
      if (el.phone?.trim() === "" || el.phone?.trim() == null ) el.phone = "--" ; 
      if (el.phone2?.trim() === "" || el.phone2?.trim() == null ) el.phone2 = "--" ; 
      if (el.guide_position?.trim() === "" || el.guide_position?.trim() == null ) el.guide_position = "--" ; 
      if (el.guide_status?.trim() === "" || el.guide_status?.trim() == null ) el.guide_status = "--" ; 
      if (el.guide_gender?.trim() === "" || el.guide_gender?.trim() == null ) el.guide_gender = "--" ; 
      if (el.guide_typeperson?.trim() === "" || el.guide_typeperson?.trim() == null ) el.guide_typeperson = "--" ; 
      if (el.DateBirth_str?.trim() === "" || el.DateBirth_str?.trim() == null ) el.DateBirth_str = "--" ; 
      if (el.s002from_str?.trim() === "" || el.s002from_str?.trim() == null ) el.s002from_str = "--" ; 
      if (el.s003from_str?.trim() === "" || el.s003from_str?.trim() == null ) el.s003from_str = "--" ; 
      if (el.rank?.toString().trim() === "" || el.rank?.toString().trim() == null || el.rank?.toString().trim() == "null" ) el.rank = "--" ; 
      if (el.senjor_guard?.trim() === "" || el.senjor_guard?.trim() == null ) el.senjor_guard = "--" ; 
      if (el.organization?.trim() === "" || el.organization?.trim() == null ) el.organization = "--" ; 
      if (el.guide_sms?.trim() === "" || el.guide_sms?.trim() == null ) el.guide_sms = "--" ; 
    });

    // при загрузке показываем без всяких ограничений
    this.ShowStaff = [...this.ORIGINAL_ShowStaff];     //JSON.parse(JSON.stringify(this.ORIGINAL_ShowStaff));

     //console.log('this.ShowStaff =', this.ShowStaff);
    });



   // список фильтров
   this.servfilter.getFilrers().subscribe( (value: any) => {
    this.listFilters = value; 
  });

}


  ngAfterViewInit() {
    // this.ColumnSizeObj =   this.tableServ.getTableWidth('staff2table');
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
      this.saveColumnSize(this.datatableComponent, 'staff2table', e.column.prop, e.newValue);
    }
}



summaryOpen(id_staff: number) {
  this.router.navigate(['summary'], { queryParams: { id_staff }});
  }


 onEnterSearch() {
   this.funcSearch();
  }
    
    

  funcSearch() {
    let sInput = (document.getElementById('search') as HTMLInputElement).value.trim().toUpperCase();

    if (sInput) {
        // console.log('ищем=',sInput);
        
        const res = this.ORIGINAL_ShowStaff.filter( (el) => {
           return (el.id_staff &&  el.id_staff.toString().toUpperCase().indexOf(sInput) != -1) ||
                  (el.fio &&  el.fio.toUpperCase().indexOf(sInput) != -1) ||
                  (el.phone &&  el.phone.toUpperCase().indexOf(sInput) != -1) ||          
                  (el.phone2 &&  el.phone2.toUpperCase().indexOf(sInput) != -1) ||
                  (el.guide_position &&  el.guide_position.toUpperCase().indexOf(sInput) != -1) ||                  
                  (el.guide_status &&  el.guide_status.toUpperCase().indexOf(sInput) != -1) ||                                    
                  (el.guide_gender &&  el.guide_gender.toUpperCase().indexOf(sInput) != -1) ||                                    
                  (el.guide_typeperson &&  el.guide_typeperson.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.sAge &&  el.sAge.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.DateBirth_str &&  el.DateBirth_str.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.s002from_str &&  el.s002from_str.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.s003from_str &&  el.s003from_str.toUpperCase().indexOf(sInput) != -1) ||                                                                                          
                  (el.rank &&  el.rank.toString().toUpperCase().indexOf(sInput) != -1) ||
                  (el.date_interview_str &&  el.date_interview_str.toUpperCase().indexOf(sInput) != -1) ||                                                      
                  (el.guide_sms &&  el.guide_sms.toUpperCase().indexOf(sInput) != -1);
        });

        // console.log('find=', res)
        this.ShowStaff =  JSON.parse(JSON.stringify(res));

      } else {
        console.log('обнуляем поиск');
        // показываем без всяких ограничений
        this.ShowStaff = JSON.parse(JSON.stringify(this.ORIGINAL_ShowStaff));
      }
    }  
  

    onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], id_staff: string, field: string, strField: string) {

      if (ev) {
       let res = smallGuide.find( (el) => el.name == ev.target.value);
       if (res) {
       if (!res.name) res.name='';
    
       let resShowStaff = this.ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff);
       if (resShowStaff) {
        resShowStaff[strField as keyof IObjectOne] = res.name;
       this.ShowStaff = [...this.ShowStaff];
       }
    
       let resShowStaffOriginal = this.ORIGINAL_ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff);
       if (resShowStaffOriginal) {
        resShowStaffOriginal[strField as keyof IObjectOne] = res.name;
        this.ORIGINAL_ShowStaff = [...this.ORIGINAL_ShowStaff];
       }
    
        this.staffserv.updateProtectedSmallGuide(Number(res.id), res.name, id_staff, field).subscribe();
    
       }
      }
    
    }




    onChangeSenjorGuard(ev: any,  senjorGuide:  ISenjorGuardGuide[], id_staff: string, field: string, strField: string) {
      if (ev) {
       let res = senjorGuide.find( (el) => el.fio == ev.target.value);
       if (res) {
        if (!res.fio) res.fio='';
  
  
        let resShowStaff = this.ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff);
        if (resShowStaff) {
         resShowStaff[strField as keyof IObjectOne] = res.fio;
        this.ShowStaff = [...this.ShowStaff];
        }
     
        let resShowStaffOriginal = this.ORIGINAL_ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff);
        if (resShowStaffOriginal) {
         resShowStaffOriginal[strField as keyof IObjectOne] = res.fio;
         this.ORIGINAL_ShowStaff = [...this.ORIGINAL_ShowStaff];
        }      
  
        this.staffserv.updateProtectedSmallGuide(Number(res.id_staff), res.fio, id_staff, field).subscribe();

       }
      }
    }



       isNumeric (n: string) {
        if (n == '0') return true; else return !!Number(n);
       }



     myUpdateNumberClick(x: any, id_staff: number, field: string, strField: string) {

      let text = x.value;
        text = text.replace('\n', '');
  
        if (!this.isNumeric(text)) {
          text = 'null';
        } 
        console.log('text =', text);
        this.staffserv.updateStaffNumber(text, id_staff.toString(), field).subscribe( (res: any) => {
          console.log('res update = ', res);
        });



        if (text == "null") text= "--";

        let resShowStaff = this.ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff.toString());
        if (resShowStaff) {
          resShowStaff[strField as keyof IObjectOne] = text;
          this.ShowStaff = [...this.ShowStaff];
        }
  
        let resShowStaffOriginal = this.ORIGINAL_ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff.toString());
        if (resShowStaffOriginal) {
        resShowStaffOriginal[strField as keyof IObjectOne] = text;
        this.ORIGINAL_ShowStaff = [...this.ORIGINAL_ShowStaff];
      }



    }

  
    // ORIGINAL_ShowStaff    
    myUpdateClick(element: any, id_staff: number, field: string, strField: string) {
      let text = element.value;
      if (!text ) text='--';
      if (text === '') text='--';

      this.staffserv.updateStaffOne(text, id_staff.toString(), field).subscribe( (res: any) => {
        console.log('res update = ', res);
      });

      //if (text="--") {

          let resShowStaff = this.ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff.toString());
          if (resShowStaff) {
            resShowStaff[strField as keyof IObjectOne] = text;
            this.ShowStaff = [...this.ShowStaff];
          }
    
          let resShowStaffOriginal = this.ORIGINAL_ShowStaff.find( (el: IObjectOne) => el.id_staff == id_staff.toString());
          if (resShowStaffOriginal) {
          resShowStaffOriginal[strField as keyof IObjectOne] = text;
          this.ORIGINAL_ShowStaff = [...this.ORIGINAL_ShowStaff];
        }

      //}
    }
  

maxInputLength(e: Event, iLength: number) {
  const text =(e.target! as HTMLInputElement).value;
  if (text.length>=iLength) {
    e.preventDefault();
   }

}

maxPasteLength(e: ClipboardEvent, iLength: number) {
  let clipboardData = e.clipboardData;
  var s = clipboardData!.getData('text')
  if (s.length>=iLength) {
    e.preventDefault();
   }

   const text =(e.target! as HTMLInputElement).value;
   if (text.length>=iLength) {
     e.preventDefault();
    }
}


    
    focusOutFunction(e: any) {
      e.target.type = '';
      e.target.value = this.datePipe.transform(e.target.value, 'dd.MM.yyyy') || '';
    }
  
    focusFunction(e: any, datestr: any) {
      e.target.type = 'date';
      e.target.value =  datestr;
    }
  
  
    idDateisValid (date: Date) {
      return date.getTime() === date.getTime();
    } 


    // Преобразование даты рождения
    setDateBirth($event: any, id_staff: number) {
      let date = new Date($event.target.value);
      const isDate = this.idDateisValid(date);
      if (isDate) {
        // console.log($event.target.value, date);
        this.staffserv.updateStaffDate(date, id_staff.toString(), 'DateBirth').subscribe( (res: any) => { console.log('res update = ', res); } );
      } else {
        // console.log($event.target.value, 'даты нет!');
        this.staffserv.updateStaffDateNull(id_staff.toString(), 'DateBirth').subscribe( (res: any) => { console.log('res update = ', res); } );
      }


      if (isDate) {      
              const res = this.ShowStaff.map( el => {
                if (el.id_staff == id_staff.toString()) {
                  el.sAge =  (new Date().getFullYear() -  date.getFullYear()).toString();
                  el.DateBirth_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
                }
                return el;
              });
            this.ShowStaff = [...res];

            const res2 = this.ORIGINAL_ShowStaff.map( el => {
              if (el.id_staff == id_staff.toString()) {
                el.sAge =  (new Date().getFullYear() -  date.getFullYear()).toString();
                el.DateBirth_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
               }
               return el;
              });
             this.ORIGINAL_ShowStaff = [...res2];

            $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '--';
       }            

       if (!isDate) {      
            const res = this.ShowStaff.map( el => {
              if (el.id_staff == id_staff.toString()) {
                el.sAge =  '--';
                el.DateBirth_str = '--';
              }
              return el;
            });
          this.ShowStaff = [...res];


          const res2 = this.ORIGINAL_ShowStaff.map( el => {
            if (el.id_staff == id_staff.toString()) {
              el.sAge =  '--';
              el.DateBirth_str = '--';
            }
            return el;
            });
          this.ORIGINAL_ShowStaff = [...res2];

          $event.target.value = '--';
        }            


        $event.target.type = '';
     
    } 
    
    

  

  set002from($event: any, id_staff: number) {
     let date = new Date($event.target.value);
     const isDate = this.idDateisValid(date);
     if (isDate) {
       // console.log($event.target.value, date);
        this.staffserv.updateStaffDate(date, id_staff.toString(), '002from').subscribe( (res: any) => { console.log('res update = ', res); } );
        } else {
         this.staffserv.updateStaffDateNull(id_staff.toString(), '002from').subscribe( (res: any) => { console.log('res update = ', res); } );
     }
    
     if (isDate) {
          const res = this.ShowStaff.map( (el: IObjectOne) => {
              if (el.id_staff == id_staff.toString()) {
                  el.s002from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
                  }
              return el;
          });
          this.ShowStaff = [...res];

          const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
            if (el.id_staff == id_staff.toString()) {
                el.s002from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
                }
            return el;
          });
          this.ORIGINAL_ShowStaff = [...res2];

          $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '--';
      }

      if (!isDate) {
         const res = this.ShowStaff.map( el => {
            if (el.id_staff == id_staff.toString()) {
                el.s002from_str = '--';
                }
            return el;
        });
        this.ShowStaff = [...res];


        const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
          if (el.id_staff == id_staff.toString()) {
              el.s002from_str ='--';
              }
          return el;
        });
        this.ORIGINAL_ShowStaff = [...res2];


        $event.target.value = '--';
      }
     $event.target.type = '';
  }    

  set003from($event: any, id_staff: number) {
    let date = new Date($event.target.value);


    const isDate = this.idDateisValid(date);


    if (isDate) {
      // console.log($event.target.value, date);
       this.staffserv.updateStaffDate(date, id_staff.toString(), '003from').subscribe( (res: any) => { console.log('res update = ', res); } );
       } else {
        this.staffserv.updateStaffDateNull(id_staff.toString(), '003from').subscribe( (res: any) => { console.log('res update = ', res); } );
    }
    
   
    if (isDate) {
         const res = this.ShowStaff.map( (el: IObjectOne) => {
             if (el.id_staff == id_staff.toString()) {
                 el.s003from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
                 }
             return el;
         });
         this.ShowStaff = [...res];

         const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
          if (el.id_staff == id_staff.toString()) {
              el.s003from_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
              }
          return el;
        });
        this.ORIGINAL_ShowStaff = [...res2];

         $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '--';
     }


     if (!isDate) {
        const res = this.ShowStaff.map( el => {
           if (el.id_staff == id_staff.toString()) {
               el.s003from_str = '--';
               }
           return el;
       });
       this.ShowStaff = [...res];

       const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
        if (el.id_staff == id_staff.toString()) {
            el.s003from_str = '--';
            }
        return el;
      });
      this.ORIGINAL_ShowStaff = [...res2];

       $event.target.value = '--';
     }

    $event.target.type = '';

 }
 
 
 addNewStaff() {

  let el: IObjectOne = {};
  const s = 'Новый сотрудник';

  
  this.staffserv.addStaff(s).subscribe( (res: any) =>
    {
      if (res.insertId) {
        el.id_staff = res.insertId;
        el.fio = s;
        el.s003from_str = this.datePipe.transform(el.s003from, 'yyyy-MM-dd') || '--';
        if (el.fio?.trim() === "" || el.fio?.trim() == null ) el.fio = "--" ; 
        if (el.phone?.trim() === "" || el.phone?.trim() == null ) el.phone = "--" ; 
        if (el.phone2?.trim() === "" || el.phone2?.trim() == null ) el.phone2 = "--" ; 
        if (el.guide_position?.trim() === "" || el.guide_position?.trim() == null ) el.guide_position = "--" ; 
        if (el.guide_status?.trim() === "" || el.guide_status?.trim() == null ) el.guide_status = "--" ; 
        if (el.guide_gender?.trim() === "" || el.guide_gender?.trim() == null ) el.guide_gender = "--" ; 
        if (el.guide_typeperson?.trim() === "" || el.guide_typeperson?.trim() == null ) el.guide_typeperson = "--" ; 
        if (el.DateBirth_str?.trim() === "" || el.DateBirth_str?.trim() == null ) el.DateBirth_str = "--" ; 
        if (el.s002from_str?.trim() === "" || el.s002from_str?.trim() == null ) el.s002from_str = "--" ; 
        if (el.s003from_str?.trim() === "" || el.s003from_str?.trim() == null ) el.s003from_str = "--" ; 
        if (el.rank?.toString().trim() === "" || el.rank?.toString().trim() == null ) el.rank = "--" ; 
        if (el.senjor_guard?.trim() === "" || el.senjor_guard?.trim() == null ) el.senjor_guard = "--" ; 
        if (el.organization?.trim() === "" || el.organization?.trim() == null ) el.organization = "--" ; 
        if (el.date_interview_str?.trim() === "" || el.date_interview_str?.trim() == null ) el.date_interview_str = "--" ;         
        if (el.guide_sms?.trim() === "" || el.guide_sms?.trim() == null ) el.guide_sms = "--" ; 

        this.ShowStaff.unshift(el);
        this.ORIGINAL_ShowStaff.unshift(el);
        this.ShowStaff = [...this.ShowStaff];
        this.ORIGINAL_ShowStaff = [...this.ORIGINAL_ShowStaff];
      }
    });
  

  
}



deleteStaff(id_staff: number, sLink: string) {
  //openDeleteModalButton
  this.curDeleteObject.sLink = sLink;
  this.curDeleteObject.id_staff = id_staff;
  document!.getElementById("openDeleteModalButton")!.click();
}



deleteClose() {
  document!.getElementById("closeDeleteModalButton")!.click();
}
  
deleteSave() {


  if (this.curDeleteObject.id_staff) {

    let idStaff = this.curDeleteObject.id_staff;
    let indexShowObjects = this.ShowStaff.findIndex( (el  =>  el.id_staff == idStaff.toString()));
    this.ShowStaff.splice(indexShowObjects,1);
    let indexOriginalShowStaff = this.ORIGINAL_ShowStaff.findIndex( (el  =>  el.id_staff == idStaff.toString()));
    this.ORIGINAL_ShowStaff.splice(indexOriginalShowStaff,1);

    //refresh data
    this.ShowStaff = [...this.ShowStaff];
    this.ORIGINAL_ShowStaff = [...this.ORIGINAL_ShowStaff];

    this.staffserv.deleteStaff(idStaff.toString()).subscribe();
  }
  this.deleteClose();
}

myEnter(event: Event) {

  if (event.target) {
    const elem = <HTMLElement>event.target;
    if (elem) elem.blur();
  }
}


loadFiltersNull() {
  this.ShowStaff = [...this.ORIGINAL_ShowStaff];
}


  onChangeFilter(curEl: any) {

    if (curEl.value.toString() == "0") {
      this.loadFiltersNull();
      return;
    }

    let res: IFilter = this.listFilters.find( (el: any) =>  el.id.toString() == curEl.value.toString());

    if (!res) {
      this.loadFiltersNull();
      return;
    }

    if (res) {
     
          let resFilter: IObjectOne[] = this.ORIGINAL_ShowStaff.filter( (el) => {
            return (el[res.field1 as keyof IObjectOne] == res.​value1)
          });

          if (res.field2?.trim() !== "" && res.field2?.trim() !== null) {
            resFilter = resFilter.filter( (el) => {
              return (el[res.field2 as keyof IObjectOne] == res.​value2)
            });
          }

          const dateBegin = Date.parse(res.dateBegin || '');
          const dateEnd = Date.parse(res.dateEnd || '');

          if (dateBegin && dateEnd) {
            console.log(dateBegin, dateEnd );
            resFilter = resFilter.filter( (el) => {
              return ( (Date.parse(el.DateCreation || '') >= dateBegin) && (Date.parse(el.DateCreation || '') <= dateEnd));
            });


          } else {
            // console.log('неправильные даты' )
          }


          this.ShowStaff = [...resFilter];


    }

  }

  clickFilters() {
    this.router.navigate(['filter']);
  }

  public Summary(id_staff: string) {
    console.log(id_staff); 
    this.router.navigate(['summary'], { queryParams: { id_staff }});
  }

  

  setDateInterview($event: any, id_staff: number) {
    let date = new Date($event.target.value);


    const isDate = this.idDateisValid(date);


    if (isDate) {
      // console.log($event.target.value, date);
       this.staffserv.updateStaffDate(date, id_staff.toString(), 'date_interview').subscribe( (res: any) => { console.log('res update = ', res); } );
       } else {
        this.staffserv.updateStaffDateNull(id_staff.toString(), 'date_interview').subscribe( (res: any) => { console.log('res update = ', res); } );
    }
    
   
    if (isDate) {
         const res = this.ShowStaff.map( (el: IObjectOne) => {
             if (el.id_staff == id_staff.toString()) {
                 el.date_interview_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
                 }
             return el;
         });
         this.ShowStaff = [...res];

         const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
          if (el.id_staff == id_staff.toString()) {
              el.date_interview_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '--';
              }
          return el;
        });
        this.ORIGINAL_ShowStaff = [...res2];

         $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '--';
     }


     if (!isDate) {
        const res = this.ShowStaff.map( el => {
           if (el.id_staff == id_staff.toString()) {
               el.date_interview_str = '--';
               }
           return el;
       });
       this.ShowStaff = [...res];

       const res2 = this.ORIGINAL_ShowStaff.map( (el: IObjectOne) => {
        if (el.id_staff == id_staff.toString()) {
            el.date_interview_str = '--';
            }
        return el;
      });
      this.ORIGINAL_ShowStaff = [...res2];

       $event.target.value = '--';
     }

    $event.target.type = '';

 }

 newGeneral(id_staff: number) {

  const url = this.router.serializeUrl(this.router.createUrlTree(['general'], {
    queryParams: {
      id_staff: id_staff
    }
  }));

  const newTab1 = window.open(url, '_blank'); 
  if(newTab1) {
      newTab1.opener = null;
  }


}



}
