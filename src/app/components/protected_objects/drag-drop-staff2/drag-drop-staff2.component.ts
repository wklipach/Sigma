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

                  this.dd_result.push({id: val.id, name: val.fio, address: "", photo_name: val.photo_name, rank: val.rank, parentId: val.id_object*(-1), id_staff: val.id_staff });

                });

          }

          //console.log('this.dd_result=', this.dd_result);
          this.dd_result = [...this.dd_result];

    });



  }  


  dragStart(event: any) {
    if (event.originalTarget) {
      if (event.originalTarget.attributes) {
         console.log('dragStart tree_id=', event.originalTarget.attributes.tree_id.value);
         this.beginTree = event.originalTarget.attributes.tree_id.value;
      }
    }
  }

  dragEnd(event: any) {


    if (event.originalTarget) {
      if (event.originalTarget.attributes) {
        if (event.originalTarget.attributes.tree_id) {
            this.endTree = event.originalTarget.attributes.tree_id.value;
            console.log('dragEnd this.beginTree = ', this.beginTree);
            console.log('dragEnd this.endTree = ', this.endTree);

            this.moveElement(this.beginTree, this.endTree);

        }
      }
    }

  }

  dragOver(event: any) {
     event.preventDefault();
  }


  moveElement(beginId: number, endId: number) {

    // если это корень выходим 
    if  (endId == 0) {
      return;
    }

    // есди это человек ищем код объекта где он служит
    if  (this.endTree > 0) {
      let elem = this.dd_result.find( elem => elem.id.toString() ==  this.endTree.toString() )
      if (elem && elem.parentId) {
        endId = elem.parentId;
      }
    }

    // если по прежнему не нашли выходим
    if  (endId >= 0) {
      return;
    }

    this.dd_result.forEach ( treeElement => {
      if (treeElement.id.toString() == beginId.toString()) {
        if (treeElement.parentId !== endId && treeElement.id_staff) {
            treeElement.parentId = endId;
            // сохраняем в базе
            this.dds.updateStaffObject(treeElement.id, treeElement.parentId*(-1), treeElement.id_staff).subscribe();
        }
      }
    });
    
    this.dd_result = [...this.dd_result];
  }

 



}
