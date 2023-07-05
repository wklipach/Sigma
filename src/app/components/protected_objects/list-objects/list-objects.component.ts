import { Component, ViewChild } from '@angular/core';
import { ListobjectsService } from 'src/app/services/listobjects.service';
import {  CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';



interface IObjectOne { 
  id_object?: string;  
  name?: string; 
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
  @ViewChild('fareObjects') virtualScroll!: CdkVirtualScrollViewport;

  constructor (private listobjectsserv: ListobjectsService) {  

  }


  ngOnInit() {
      this.listobjectsserv.getProtectedObjectsOne().subscribe ( (value: any) => {
        this.ShowObjects = value;
        console.log('this.ShowObjects =', this.ShowObjects);
      });
  }


  clicObject(objectone: IObjectOne) {
      alert(objectone.name );
  }
 

}
