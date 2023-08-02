import { Component, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { ListobjectsService } from 'src/app/services/listobjects.service';
import {  CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GuideService } from 'src/app/services/guide.service';
import { DatePipe } from '@angular/common';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { TableService } from 'src/app/services/table.service';
import { ITable } from 'src/app/interface/table';
import { Router } from '@angular/router';
import { GlobalRef } from 'globalref';


interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface ISenjorGuardGuide { 
  id?: string;  
  id_staff?: string;  
  fio?: string; 
}


interface IObjectOne { 
  id_object?: string;  
  name?: string; 
  id_post_status?: string; 
  post_status?: string; 
  options?: string; 
  id_organization?: string; 
  cur_organization?: string;   
  address?: string; 
  yandex_maps?: string;  
  google_maps?: string;  
  phone?: string; 
  id_senjor_guard?: string; 
  senjor_guard?: string; 
  postwasset_date?: string; 
  postwassetdate_str?: string; 
  withdrawal_date?: string;  
  withdrawaldate_str?: string;  
  id_mtr?: string; 
  MTR?: string; 
  id_customer?: string; 
  customer?: string; 
  id_object_type?: string; 
  object_type?: string; 

};

interface IMaps {
  id_objects?: number;
  sLink?: string;
}

interface IDeleteObject {
  id_objects?: number;
  sLink?: string;
}


@Component({
  selector: 'app-obj2',
  templateUrl: './obj2.component.html',
  styleUrls: ['./obj2.component.css']
})
export class Obj2Component {

  ColumnMode = ColumnMode;
  @ViewChild('Obj2Table') datatableComponent!: DatatableComponent;

  faCoffee = faCoffee;

    //содержит ширины столбцов, взятые из хранилища
  ColumnSizeObj:  ITable[] = [];


  // то что показывается в таблице - ограниченно строкой поиска
  ShowObjects: IObjectOne[] = [];
  // все что скачано с сервера
  ORIGINAL_ShowObjects: IObjectOne[] = [];

  // объект для модального окна кнопок карты
  curMaps: IMaps = {};

  //объект для модального окна удаления
  curDeleteObject: IDeleteObject = {};

  editing: any = {};


  guidePostStatus:  ISmallGuide[] = [];
  guideOrganization:  ISmallGuide[] = [];
  guideMTR:  ISmallGuide[] = [];
  guideSenjorGuard:  ISenjorGuardGuide[] = [];
  guideCustomers:  ISmallGuide[] = [];
  guideObjectType:  ISmallGuide[] = [];

  @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;

  constructor (private listobjectsserv: ListobjectsService, 
               private servguide: GuideService, 
               private datePipe: DatePipe,
               private tableServ:  TableService,
               private router: Router,
               public gr: GlobalRef ) {  

  }


  ngOnInit() {

    this.ColumnSizeObj =   this.tableServ.getTableWidth('Obj2Table');

    this.servguide.getSenjorGuard().subscribe( (value: any) => {
      this.guideSenjorGuard = value; 
      //console.log('guideSenjorGuard', this.guideSenjorGuard);
    });

    this.servguide.getSmallGuide('guide_post_status').subscribe( (value: any) => {
        this.guidePostStatus = value; 
       // console.log('guidePostStatus', this.guidePostStatus);
    });

    this.servguide.getSmallGuide('guide_mtr').subscribe( (value: any) => {
      this.guideMTR = value; 
      //console.log('guideMTR', this.guideMTR);
  });


    this.servguide.getSmallGuide('guide_organization').subscribe( (value: any) => {
      this.guideOrganization = value; 
      //console.log('guideOrganization', this.guideOrganization);
  });

   this.servguide.getSmallGuide('guide_customers').subscribe( (value: any) => {
    this.guideCustomers = value; 
    //console.log('guideCustomers', this.guideCustomers);
  });

  this.servguide.getSmallGuide('guide_object_type').subscribe( (value: any) => {
    this.guideObjectType = value; 
    //console.log('guideObjectType', this.guideObjectType);
  });
    
    
      this.listobjectsserv.getProtectedObjectsOne().subscribe ( (value: any) => {
        this.ORIGINAL_ShowObjects = value;
        // posts.forEach((post)=>post.id===1?post.text='other text':post.text=post.text)
        this.ORIGINAL_ShowObjects.forEach((el)=>
        {
          el.postwassetdate_str = this.datePipe.transform(el.postwasset_date, 'yyyy-MM-dd') || '--';
          el.withdrawaldate_str = this.datePipe.transform(el.withdrawal_date, 'yyyy-MM-dd') || '--';

          if (el.name?.trim() === "" || el.name?.trim() == null) el.name = "--" ; 
          if (el.post_status?.trim() === "" || el.post_status?.trim() == null) el.post_status = "--" ; 
          if (el.object_type?.trim() === "" || el.object_type?.trim() == null) el.object_type = "--" ; 
          if (el.options?.trim() === "" || el.options?.trim() == null) el.options = "--" ;
          if (el.cur_organization?.trim() === "" || el.cur_organization?.trim() == null) el.cur_organization = "--" ;     
          if (el.address?.trim() === "" || el.address?.trim() == null) el.address = "--" ;     
          if (el.phone?.trim() === "" || el.phone?.trim() == null) el.phone = "--" ;     
          if (el.senjor_guard?.trim() === "" || el.senjor_guard?.trim() == null) el.senjor_guard = "--" ;     
          if (el.MTR?.trim() === "" || el.MTR?.trim() == null) el.MTR = "--" ;   
          if (el.customer?.trim() === "" || el.customer?.trim() == null) el.customer = "--" ;     
          
        });

        // при загрузке показываем без всяких ограничений
        this.ShowObjects = JSON.parse(JSON.stringify(this.ORIGINAL_ShowObjects));

         //console.log('this.ShowObjects =', this.ShowObjects);
      });


  }


  clicObject(objectone: IObjectOne) {
      alert(objectone.name );
  }
 

  myUpdateClick(element: any, id_object: number, field: string, strField: string) {
    let text = element.value;
    if (!text ) text='--';
    if (text === '') text='--';
    this.listobjectsserv.updateProtectedOne(text.toString().trim(), id_object.toString(), field).subscribe( (res: any) => {
      //console.log('res update = ', res);
    });
  
    //if (text="--") {
        let resShowObjects = this.ShowObjects.find( (el: IObjectOne) => el.id_object == id_object.toString());
        if (resShowObjects) {
          resShowObjects[strField as keyof IObjectOne] = text;
          this.ShowObjects = [...this.ShowObjects];
        }
  
        let resShowObjectsOriginal = this.ORIGINAL_ShowObjects.find( (el: IObjectOne) => el.id_object == id_object.toString());
        if (resShowObjectsOriginal) {
        resShowObjectsOriginal[strField as keyof IObjectOne] = text;
        this.ORIGINAL_ShowObjects = [...this.ORIGINAL_ShowObjects];
      }
    //}
  }


  /*
  onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], id_object: string, field: string) {
    if (ev) {
     let res = smallGuide.find( (el) => Number(el.id) == Number(ev.target.value));
     if (res) {
      if (!res.name) res.name='';
      this.listobjectsserv.updateProtectedSmallGuide(Number(res.id), res.name, id_object, field).subscribe(value => {
        //console.log(value);
      })
     }
    }
  }
*/

  onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], id_object: string, field: string, strField: string) {

    if (ev) {
     let res = smallGuide.find( (el) => el.name == ev.target.value);
     if (res) {
     if (!res.name) res.name='';
  
     let resShowObjects = this.ShowObjects.find( (el: IObjectOne) => el.id_object == id_object);
     if (resShowObjects) {
      resShowObjects[strField as keyof IObjectOne] = res.name;
     this.ShowObjects = [...this.ShowObjects];
     }
  
     let resShowObjectsOriginal = this.ORIGINAL_ShowObjects.find( (el: IObjectOne) => el.id_object == id_object);
     if (resShowObjectsOriginal) {
      resShowObjectsOriginal[strField as keyof IObjectOne] = res.name;
      this.ORIGINAL_ShowObjects = [...this.ORIGINAL_ShowObjects];
     }
  
      this.listobjectsserv.updateProtectedSmallGuide(Number(res.id), res.name, id_object, field).subscribe( value => {
        //console.log(value);
      });
  
     }
    }
  
  }
    
  onChangeSenjorGuard(ev: any,  senjorGuide:  ISenjorGuardGuide[], id_object: string, field: string, strField: string) {
    if (ev) {
     let res = senjorGuide.find( (el) => el.fio == ev.target.value);
     if (res) {
      if (!res.fio) res.fio='';


      let resShowObjects = this.ShowObjects.find( (el: IObjectOne) => el.id_object == id_object);
      if (resShowObjects) {
       resShowObjects[strField as keyof IObjectOne] = res.fio;
      this.ShowObjects = [...this.ShowObjects];
      }
   
      let resShowObjectsOriginal = this.ORIGINAL_ShowObjects.find( (el: IObjectOne) => el.id_object == id_object);
      if (resShowObjectsOriginal) {
       resShowObjectsOriginal[strField as keyof IObjectOne] = res.fio;
       this.ORIGINAL_ShowObjects = [...this.ORIGINAL_ShowObjects];
      }      

      this.listobjectsserv.updateProtectedSmallGuide(Number(res.id_staff), res.fio, id_object, field).subscribe(value => {
        //console.log(value);
      })
     }
    }
  }

  
  maxInputLength(e: Event, iLength: number) {
      
    const text =(e.target! as HTMLInputElement).innerText;
    console.log('text=', text, 'text.length=', text.length);
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
  }; 


  setDatePostwassetdate($event: any, id_object: number) {

      let date = new Date($event.target.value);
      const isDate = this.idDateisValid(date);

       
      if (isDate) {
        // console.log($event.target.value, date);
        this.listobjectsserv.updateProtectedDate(date, id_object.toString(), 'postwasset_date').subscribe( (res: any) => { console.log('res update = ', res); } );
      } else {
        // console.log($event.target.value, 'даты нет!');
        this.listobjectsserv.updateProtectedDateNull(id_object.toString(), 'postwasset_date').subscribe( (res: any) => { console.log('res update = ', res); } );
      }


      if (isDate) {
        const res = this.ShowObjects.map( (el: IObjectOne) => {
            if (el.id_object == id_object.toString()) {
                el.postwassetdate_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
                }
            return el;
        });
        this.ShowObjects = [...res];

        const res2 = this.ORIGINAL_ShowObjects.map( (el: IObjectOne) => {
          if (el.id_object == id_object.toString()) {
              el.postwassetdate_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
              }
          return el;
        });
        this.ORIGINAL_ShowObjects = [...res2];

        $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '';
    }


    if (!isDate) {
      const res = this.ShowObjects.map( (el: IObjectOne) => {
          if (el.id_object == id_object.toString()) {
              el.postwassetdate_str = '';
              }
          return el;
      });
      this.ShowObjects = [...res];

      const res2 = this.ORIGINAL_ShowObjects.map( (el: IObjectOne) => {
        if (el.id_object == id_object.toString()) {
            el.postwassetdate_str = '';
            }
        return el;
      });
      this.ORIGINAL_ShowObjects = [...res2];

      $event.target.value = '';
  }

      $event.target.type = '';

  }


  setDateWithdrawaldate($event: any, id_object: number) {
    let date = new Date($event.target.value);
    const isDate = this.idDateisValid(date);
       
    if (this.idDateisValid(date)) {
      // console.log($event.target.value, date);
      this.listobjectsserv.updateProtectedDate(date, id_object.toString(), 'withdrawal_date').subscribe( (res: any) => { console.log('res update = ', res); } );
    } else {
      // console.log($event.target.value, 'даты нет!');
      this.listobjectsserv.updateProtectedDateNull(id_object.toString(), 'withdrawal_date').subscribe( (res: any) => { console.log('res update = ', res); } );
    }


    if (isDate) {
      const res = this.ShowObjects.map( (el: IObjectOne) => {
          if (el.id_object == id_object.toString()) {
              el.withdrawaldate_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
              }
          return el;
      });
      this.ShowObjects = [...res];

      const res2 = this.ORIGINAL_ShowObjects.map( (el: IObjectOne) => {
        if (el.id_object == id_object.toString()) {
          el.withdrawaldate_str = this.datePipe.transform(date, 'yyyy-MM-dd') || '';
            }
        return el;
      });
      this.ORIGINAL_ShowObjects = [...res2];

      $event.target.value = this.datePipe.transform(date, 'dd.MM.yyyy') || '';
  }


      if (!isDate) {
        const res = this.ShowObjects.map( (el: IObjectOne) => {
            if (el.id_object == id_object.toString()) {
                el.withdrawaldate_str = '';
                }
            return el;
        });
        this.ShowObjects = [...res];

        const res2 = this.ORIGINAL_ShowObjects.map( (el: IObjectOne) => {
          if (el.id_object == id_object.toString()) {
            el.withdrawaldate_str = '';
              }
          return el;
        });
        this.ORIGINAL_ShowObjects = [...res2];

        $event.target.value = '';
    }


    $event.target.type = '';
 
  }


  onEnterSearch() {
    this.funcSearch();
    }
    

  funcSearch() {
    let sInput = (document.getElementById('search') as HTMLInputElement).value.trim().toUpperCase();

    if (sInput) {
        // console.log('ищем=',sInput);
        
        const res = this.ORIGINAL_ShowObjects.filter( (el) => {
           return (el.id_object &&  el.id_object.toString().toUpperCase().indexOf(sInput) != -1) ||
                  (el.name &&  el.name.toUpperCase().indexOf(sInput) != -1) ||
                  (el.post_status && el.post_status.toUpperCase().indexOf(sInput) !=-1)  ||
                  (el.options && el.options?.toUpperCase().indexOf(sInput) != -1)  ||
                  (el.cur_organization && el.cur_organization?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.address && el.address?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.phone && el.phone?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.senjor_guard && el.senjor_guard?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.postwassetdate_str && el.postwassetdate_str?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.withdrawaldate_str && el.withdrawaldate_str?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.MTR && el.MTR?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.customer && el.customer?.toUpperCase().indexOf(sInput) != -1);
        });

        
        //this.ShowObjects =  JSON.parse(JSON.stringify(res));
        this.ShowObjects =  [...res];
      } else {
        // показываем без всяких ограничений
        //this.ShowObjects = JSON.parse(JSON.stringify(this.ORIGINAL_ShowObjects));
        this.ShowObjects = [...this.ORIGINAL_ShowObjects];
      }
    }


     onClickGoogle(id_oblect: number, google_link: string) {
      this.curMaps.id_objects = id_oblect;
      this.curMaps.sLink = google_link;
      document!.getElementById("openGoogleModalButton")!.click();
     }
      
     onClickYandex(id_oblect: number, yandex_link: string) {
      this.curMaps.id_objects = id_oblect;
      this.curMaps.sLink = yandex_link;
      document!.getElementById("openYandexModalButton")!.click();
  }


  googleClose() {
    document!.getElementById("closeGoogleModalButton")!.click();
  }

  yandexClose() {
    document!.getElementById("closeYandexModalButton")!.click();
  }
  
  yandexSave() {
    if (!this.curMaps.sLink) { this.curMaps.sLink = ''; }
    // вставляем во все массивы
     (this.ShowObjects.find(el => el.id_object == this.curMaps.id_objects) as IObjectOne).yandex_maps = this.curMaps.sLink;
     (this.ORIGINAL_ShowObjects.find(el => el.id_object == this.curMaps.id_objects) as IObjectOne).yandex_maps = this.curMaps.sLink;
    // вставляем в базу
    this.listobjectsserv.updateProtectedOne(this.curMaps.sLink, this.curMaps.id_objects!.toString(), 'yandex_maps').subscribe();
    this.yandexClose();
  }
    
  googleSave() {
    if (!this.curMaps.sLink) { this.curMaps.sLink = ''; }
    // вставляем во все массивы
     (this.ShowObjects.find(el => el.id_object == this.curMaps.id_objects) as IObjectOne).google_maps = this.curMaps.sLink;
     (this.ORIGINAL_ShowObjects.find(el => el.id_object == this.curMaps.id_objects) as IObjectOne).google_maps = this.curMaps.sLink;
    // вставляем в базу
    this.listobjectsserv.updateProtectedOne(this.curMaps.sLink, this.curMaps.id_objects!.toString(), 'google_maps').subscribe();
    this.googleClose();
  }
 
  deleteObject(id_objects: number, sLink: string) {
      //openDeleteModalButton
      this.curDeleteObject.sLink = sLink;
      this.curDeleteObject.id_objects = id_objects;
      document!.getElementById("openDeleteModalButton")!.click();
    }


    deleteClose() {
      document!.getElementById("closeDeleteModalButton")!.click();
    }
      
    deleteSave() {


      if (this.curDeleteObject.id_objects) {

        let idObject = this.curDeleteObject.id_objects;
        let indexShowObjects = this.ShowObjects.findIndex( (el  =>  el.id_object == idObject.toString()));
        this.ShowObjects.splice(indexShowObjects,1);
        let indexOriginalShowObjects = this.ORIGINAL_ShowObjects.findIndex( (el  =>  el.id_object == idObject.toString()));
        this.ORIGINAL_ShowObjects.splice(indexOriginalShowObjects,1);

        //refresh data
        this.ShowObjects = [...this.ShowObjects];
        this.ORIGINAL_ShowObjects = [...this.ORIGINAL_ShowObjects];

        this.listobjectsserv.deleteObject(idObject.toString()).subscribe();
      }
      this.deleteClose();
    }


    addNewObject() {

      let item: IObjectOne = {};
      const s = 'Новый объект';

      this.listobjectsserv.addObject(s).subscribe( (res: any) =>
        {
          if (res.insertId) {
            item.id_object = res.insertId;
            item.name = s;
            if (item.postwassetdate_str?.trim() === "" || item.postwassetdate_str?.trim() == null )  item.postwassetdate_str='--';
            if (item.withdrawaldate_str?.trim() === "" || item.withdrawaldate_str?.trim() == null )  item.withdrawaldate_str='--';
            if (item.name?.trim() === "" || item.name?.trim() == null) item.name = "--" ; 
            if (item.post_status?.trim() === "" || item.post_status?.trim() == null) item.post_status = "--" ; 
            if (item.object_type?.trim() === "" || item.object_type?.trim() == null) item.object_type = "--" ; 
            if (item.options?.trim() === "" || item.options?.trim() == null) item.options = "--" ;
            if (item.cur_organization?.trim() === "" || item.cur_organization?.trim() == null) item.cur_organization = "--" ;     
            if (item.address?.trim() === "" || item.address?.trim() == null) item.address = "--" ;     
            if (item.phone?.trim() === "" || item.phone?.trim() == null) item.phone = "--" ;     
            if (item.senjor_guard?.trim() === "" || item.senjor_guard?.trim() == null) item.senjor_guard = "--" ;     
            if (item.MTR?.trim() === "" || item.MTR?.trim() == null) item.MTR = "--" ;   
            if (item.customer?.trim() === "" || item.customer?.trim() == null) item.customer = "--" ;     
  
            this.ShowObjects.unshift(item);
            this.ORIGINAL_ShowObjects.unshift(item);
            this.ShowObjects = [...this.ShowObjects];
          }
        });
      
    }
        
    myEnter(event: Event) {

      if (event.target) {
        const elem = <HTMLElement>event.target;
        if (elem) elem.blur();
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


    newTask(id_object: number, name: string) {

      const url = this.router.serializeUrl(this.router.createUrlTree(['addtask'], {
        queryParams: {
          id_object: id_object,
          name: name
        }
      }));

      const newTab = window.open(url, '_blank'); 
      if(newTab) {
          newTab.opener = null;
      }


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
        this.saveColumnSize(this.datatableComponent, 'Obj2Table', e.column.prop, e.newValue);
      }
  }
  

}
