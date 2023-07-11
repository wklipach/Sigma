import { Component, ViewChild } from '@angular/core';
import { ListobjectsService } from 'src/app/services/listobjects.service';
import {  CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { GuideService } from 'src/app/services/guide.service';


interface ISmallGuide { 
  id?: string;  
  name?: string; 
}

interface IObjectOne { 
  id_object?: string;  
  name?: string; 
  id_post_status?: string; 
  post_status?: string; 
  object_type?: string; 
  options?: string; 
  cur_organization?: string;   
  address?: string; 
  yandex_maps?: string;  
  google_maps?: string;  
  phone?: string; 
  senjor_guard?: string; 
  postwasset_date?: string; 
  withdrawal_date?: string;  
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

  @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;

  constructor (private listobjectsserv: ListobjectsService, private servguide: GuideService) {  

  }


  ngOnInit() {



    this.servguide.getSmallGuide('guide_post_status').subscribe( (value: any) => {
        this.guidePostStatus = value; 
        console.log('guidePostStatus', this.guidePostStatus);
    })
    
      this.listobjectsserv.getProtectedObjectsOne().subscribe ( (value: any) => {
        this.ShowObjects = value;
        // console.log('this.ShowObjects =', this.ShowObjects);
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
