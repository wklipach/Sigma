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
  object_type?: string; 
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
};




@Component({
  selector: 'app-list-objects',
  templateUrl: './list-objects.component.html',
  styleUrls: ['./list-objects.component.css']
})
export class ListObjectsComponent {

  ShowObjects: IObjectOne[] = [];
  guidePostStatus:  ISmallGuide[] = [];
  guideOrganization:  ISmallGuide[] = [];
  guideMTR:  ISmallGuide[] = [];
  guideSenjorGuard:  ISenjorGuardGuide[] = [];

  @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;

  constructor (private listobjectsserv: ListobjectsService, 
               private servguide: GuideService, 
               private datePipe: DatePipe) {  

  }


  ngOnInit() {


    this.servguide.getSenjorGuard().subscribe( (value: any) => {
      this.guideSenjorGuard = value; 
      console.log('guideSenjorGuard', this.guideSenjorGuard);
    });

    this.servguide.getSmallGuide('guide_post_status').subscribe( (value: any) => {
        this.guidePostStatus = value; 
        console.log('guidePostStatus', this.guidePostStatus);
    });

    this.servguide.getSmallGuide('guide_mtr').subscribe( (value: any) => {
      this.guideMTR = value; 
      console.log('guideMTR', this.guideMTR);
  });


    this.servguide.getSmallGuide('guide_organization').subscribe( (value: any) => {
      this.guideOrganization = value; 
      console.log('guideOrganization', this.guideOrganization);
  });
    
    
      this.listobjectsserv.getProtectedObjectsOne().subscribe ( (value: any) => {
        this.ShowObjects = value;


        // posts.forEach((post)=>post.id===1?post.text='other text':post.text=post.text)
        this.ShowObjects.forEach((el)=>
        {
          el.postwassetdate_str = this.datePipe.transform(el.postwasset_date, 'yyyy-MM-dd') || undefined;
          el.withdrawaldate_str = this.datePipe.transform(el.withdrawaldate_str, 'yyyy-MM-dd') || undefined;
        });


         console.log('this.ShowObjects =', this.ShowObjects);
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
      console.log('res update = ', res);
    } );


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


}
