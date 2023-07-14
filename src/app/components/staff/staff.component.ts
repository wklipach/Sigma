import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {  CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GuideService } from 'src/app/services/guide.service';
import { StaffService } from 'src/app/services/staff.service';
import { Router } from '@angular/router';



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
}

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent {


    // то что показывается в таблице - ограниченно строкой поиска
    ShowStaff: IObjectOne[] = [];
    // все что скачано с сервера
    ORIGINAL_ShowStaff: IObjectOne[] = [];

    guidePosition:  ISmallGuide[] = [];
    guideStatus:  ISmallGuide[] = [];

    guideSenjorGuard:  ISenjorGuardGuide[] = [];


    @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;
      
  constructor (private staffserv: StaffService, 
    private servguide: GuideService, 
    private datePipe: DatePipe,
    private router: Router) {  
}


ngOnInit() {




  this.servguide.getSmallGuide('guide_position').subscribe( (value: any) => {
    this.guidePosition = value; 
});


  this.servguide.getSmallGuide('guide_status').subscribe( (value: any) => {
    this.guideStatus = value; 
  });

  this.servguide.getSenjorGuard().subscribe( (value: any) => {
    this.guideSenjorGuard = value; 
    //console.log('guideSenjorGuard', this.guideSenjorGuard);
  });




  this.staffserv.getStaff_All().subscribe ( (value: any) => {
    console.log('value=', value);
    this.ORIGINAL_ShowStaff = value;
    console.log('this.ORIGINAL_ShowStaff=', this.ORIGINAL_ShowStaff);
    this.ORIGINAL_ShowStaff.forEach((el)=>
    {
      el.DateBirth_str = this.datePipe.transform(el.DateBirth, 'yyyy-MM-dd') || '';
      el.s002from_str = this.datePipe.transform(el.s002from, 'yyyy-MM-dd') || '';
      el.s003from_str = this.datePipe.transform(el.s003from, 'yyyy-MM-dd') || '';
    });

    // при загрузке показываем без всяких ограничений
    this.ShowStaff = [...this.ORIGINAL_ShowStaff];     //JSON.parse(JSON.stringify(this.ORIGINAL_ShowStaff));

     console.log('this.ShowStaff =', this.ShowStaff);
  });

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
                  (el.rank &&  el.rank.toString().toUpperCase().indexOf(sInput) != -1);
        });



        // console.log('find=', res)
        this.ShowStaff =  JSON.parse(JSON.stringify(res));

      } else {
        console.log('обнуляем поиск');
        // показываем без всяких ограничений
        this.ShowStaff = JSON.parse(JSON.stringify(this.ORIGINAL_ShowStaff));
      }
    }  
  

    onChangeSmallGuide(ev: any,  smallGuide:  ISmallGuide[], id_object: string, field: string) {
      if (ev) {
       let res = smallGuide.find( (el) => Number(el.id) == Number(ev.target.value));
       if (res) {
        if (!res.name) res.name='';
        this.staffserv.updateProtectedSmallGuide(Number(res.id), res.name, id_object, field).subscribe();
       }
      }
    }


    onChangeSenjorGuard(ev: any,  senjorGuide:  ISenjorGuardGuide[], id_object: string, field: string) {
      if (ev) {
       let res = senjorGuide.find( (el) => Number(el.id_staff) == Number(ev.target.value));
       if (res) {
        if (!res.fio) res.fio='';
        this.staffserv.updateProtectedSmallGuide(Number(res.id_staff), res.fio, id_object, field).subscribe();
       }
      }
    }
  



  

}
