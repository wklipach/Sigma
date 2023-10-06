import { Component, ElementRef, Input, ViewChild } from '@angular/core';
// import * as d3 from 'd3';
// import {drag} from 'd3-drag';
import { ICard } from 'src/app/interface/staff/drag-drop-staff';
import { DragDropStaffService } from 'src/app/services/drag-drop-staff.service';

import { GlobalRef } from 'globalref';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';


interface IDDResult {
  head: string;
  id_object: number;
  address: string;
  items: ICard[];
}

interface IDDResult2 {
  id: number;
  name: string;
  address: string;
  photo_name: string;
  rank: string;
  parentId?: number;
  id_staff?: number;
}


interface IObj {
  id: number;
  name: string;
  address: string;
}

@Component({
  selector: 'app-drag-drop-staff2',
  templateUrl: './drag-drop-staff2.component.html',
  styleUrls: ['./drag-drop-staff2.component.css']
})
export class DragDropStaff2Component {

  beginTree: number = -1;
  endTree: number = -1;
  //data: any;
  dd_array: IObj[] = [];
  dd_result: IDDResult2[] = [];

  data = [
    {
      name: "Иван Иванов",
      profileUrl : "assets/img/avatar.png",
      area: "Дом1",
      id: 1,
      parentId: null
    },
    {
      name: "Петр Петров",
      profileUrl : "assets/img/avatar.png",
      area: "Дом2",
      id: 2,
      parentId: 1
    },
    {
      name: "Федор Федоров",
      profileUrl : "assets/img/avatar.png",
      area: "Дом3",
      id: 3,
      parentId: 1 
    }
  ];


  constructor(private dds: DragDropStaffService, private gr: GlobalRef, private route: ActivatedRoute) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const dd_param: number[] = JSON.parse(params['navSettings']);
      const strParam = dd_param.join(',');
      
       this.dds.getDDProtObj(strParam).subscribe( (res: any) => {
        //console.log('res=', res);
         this.dd_array = res;
         this.loadData();
       });

      }
    );  

  }

  loadData() {



    this.dd_result.push({id: 0, name: "", address: "", photo_name: "/assets/img/dots.png", rank: "", parentId: undefined});

    for (let i = 0; i < this.dd_array.length; i++) {

      this.dd_result.push( {id: this.dd_array[i].id*(-1), 
                            name: this.dd_array[i].name, 
                            address: this.dd_array[i].address, 
                            photo_name: "/assets/img/usernull.jpg", 
                            rank: '', 
                            parentId: 0} );

        //this.dd_result.push( {name: this.dd_array[i].name, id_object: this.dd_array[i].id, address: this.dd_array[i].address, items: itemRes});
    }

    let sources: Observable<any>[] = [];
    for (let i = 0; i < this.dd_array.length; i++) {
      sources.push(this.dds.getDragDrop(this.dd_array[i].id))
    }

    forkJoin(sources)
    .subscribe(dataArray => {
        
          for (let i = 0; i < this.dd_array.length; i++) {
            let itemRes: ICard[] = [];
                dataArray[i].map( (val: any) => {
                  
                  if (!val.photo_name) val.photo_name="/assets/img/usernull.jpg"; else val.photo_name= this.gr.sUrlAvatarGlobal+ val.photo_name;
                  if (!val.rank) val.rank = "";

                  this.dd_result.push({id: val.id, name: val.fio, address: "", photo_name: val.photo_name, rank: val.rank, parentId: val.id_object*(-1) });

                });

                //console.log('i=', i, 'dataArray[i]=', dataArray[i]);

                //id: number;
                //name: string;
                //address: string;
                //photo_name: string;
                //rank: string;
                //parentId?: number;                

            
                //this.dd_result.push( {name: this.dd_array[i].name, id_object: this.dd_array[i].id, address: this.dd_array[i].address, items: itemRes});

          }

          //console.log('this.dd_result=', this.dd_result);
          this.dd_result = [...this.dd_result];
       

    });



  }  


  dragStart(event: any) {

    event.dataTransfer.setData("text/plain", event.target.id);


    if (event.originalTarget) {
      if (event.originalTarget.attributes) {
         console.log('dragStart=', event.originalTarget.attributes);
      }
    }
  }

  dragEnd(event: any) {
    console.log('dragEnd');
  }

  dragOver(event: any) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'point'; // ставим тип курсора

  }


  moveElement(beginId: number, endId: number) {
    this.data.forEach ( treeElement => {
      if (treeElement.id.toString() == beginId.toString()) {
        treeElement.parentId = endId;
      }
    });

    //console.log('this.data2', this.data);

    this.data = [...this.data];
    
  }



  



}
