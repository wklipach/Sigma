import { Component, ViewChild } from '@angular/core';
import { ListobjectsService } from 'src/app/services/listobjects.service';
import {  CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GuideService } from 'src/app/services/guide.service';
import { DatePipe } from '@angular/common';


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


@Component({
  selector: 'app-list-objects',
  templateUrl: './list-objects.component.html',
  styleUrls: ['./list-objects.component.css']
})
export class ListObjectsComponent {


  // то что показывается в таблице - ограниченно строкой поиска
  ShowObjects: IObjectOne[] = [];

  // все что скачано с сервера
  ORIGINAL_ShowObjects: IObjectOne[] = [];



  guidePostStatus:  ISmallGuide[] = [];
  guideOrganization:  ISmallGuide[] = [];
  guideMTR:  ISmallGuide[] = [];
  guideSenjorGuard:  ISenjorGuardGuide[] = [];
  guideCustomers:  ISmallGuide[] = [];
  guideObjectType:  ISmallGuide[] = [];

  @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;

  constructor (private listobjectsserv: ListobjectsService, 
               private servguide: GuideService, 
               private datePipe: DatePipe) {  

  }


  ngOnInit() {


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
          el.postwassetdate_str = this.datePipe.transform(el.postwasset_date, 'yyyy-MM-dd') || '';
          el.withdrawaldate_str = this.datePipe.transform(el.withdrawal_date, 'yyyy-MM-dd') || '';
        });

        // при загрузке показываем без всяких ограничений
        this.ShowObjects = JSON.parse(JSON.stringify(this.ORIGINAL_ShowObjects));

         //console.log('this.ShowObjects =', this.ShowObjects);
      });


  }


  clicObject(objectone: IObjectOne) {
      alert(objectone.name );
  }
 

  myUpdateClick(x: any, id_object: number, field: string) {
    
    let text = x.innerText;
    if (!text ) text='';
    console.log(text, id_object, field);


    this.listobjectsserv.updateProtectedOne(text, id_object.toString(), field).subscribe( (res: any) =>
    {
      //console.log('res update = ', res);
    } );


  }


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
    
  onChangeSenjorGuard(ev: any,  senjorGuide:  ISenjorGuardGuide[], id_object: string, field: string) {
    if (ev) {
     let res = senjorGuide.find( (el) => Number(el.id_staff) == Number(ev.target.value));
     if (res) {
      if (!res.fio) res.fio='';
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
       
      if (this.idDateisValid(date)) {
        // console.log($event.target.value, date);
        this.listobjectsserv.updateProtectedDate(date, id_object.toString(), 'postwasset_date').subscribe( (res: any) => { console.log('res update = ', res); } );
      } else {
        // console.log($event.target.value, 'даты нет!');
        this.listobjectsserv.updateProtectedDateNull(id_object.toString(), 'postwasset_date').subscribe( (res: any) => { console.log('res update = ', res); } );
      }
  }


  setDateWithdrawaldate($event: any, id_object: number) {
    let date = new Date($event.target.value);
       
    if (this.idDateisValid(date)) {
      // console.log($event.target.value, date);
      this.listobjectsserv.updateProtectedDate(date, id_object.toString(), 'withdrawal_date').subscribe( (res: any) => { console.log('res update = ', res); } );
    } else {
      // console.log($event.target.value, 'даты нет!');
      this.listobjectsserv.updateProtectedDateNull(id_object.toString(), 'withdrawal_date').subscribe( (res: any) => { console.log('res update = ', res); } );
    }

  }


  funcSearch() {

    console.log('h1');
    let sInput = (document.getElementById('search') as HTMLInputElement).value.trim().toUpperCase();

    if (sInput) {
        // console.log('ищем=',sInput);
        
        const res = this.ORIGINAL_ShowObjects.filter( (el) => {
           return (el.name &&  el.name.toUpperCase().indexOf(sInput) != -1) ||
                  (el.post_status && el.post_status.toUpperCase().indexOf(sInput) !=-1)  ||

                  (el.options && el.options?.toUpperCase().indexOf(sInput) != -1)  ||
                  (el.cur_organization && el.cur_organization?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.address && el.address?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.phone && el.phone?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.senjor_guard && el.senjor_guard?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.postwasset_date && el.postwasset_date?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.postwassetdate_str && el.postwassetdate_str?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.withdrawal_date && el.withdrawal_date?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.withdrawaldate_str && el.withdrawaldate_str?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.MTR && el.MTR?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.customer && el.customer?.toUpperCase().indexOf(sInput) != -1) ||
                  (el.customer && el.customer?.toUpperCase().indexOf(sInput) != -1);
        });

        // console.log('find=', res)
        this.ShowObjects =  JSON.parse(JSON.stringify(res));

      } else {
        console.log('обнуляем поиск');
        // показываем без всяких ограничений
        this.ShowObjects = JSON.parse(JSON.stringify(this.ORIGINAL_ShowObjects));
      }
    }
    

}
