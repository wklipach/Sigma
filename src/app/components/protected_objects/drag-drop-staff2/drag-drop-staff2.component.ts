import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import {drag} from 'd3-drag';

@Component({
  selector: 'app-drag-drop-staff2',
  templateUrl: './drag-drop-staff2.component.html',
  styleUrls: ['./drag-drop-staff2.component.css']
})
export class DragDropStaff2Component {

  beginTree: number = -1;
  endTree: number = -1;

  //data: any;

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


  constructor() {}

  ngOnInit() {


    

/*
    d3.csv(
      //'https://raw.githubusercontent.com/bumbeishvili/sample-data/main/org.csv'
      'assets/test.csv'
    ).then(data => {
      this.data = data;
      let prevIndex = 0;
    });
*/    

  }


  dragStart(event: any) {
    this.beginTree =  -1;

    if (event.originalTarget) {
      if (event.originalTarget.attributes) {
        if (event.originalTarget.attributes.tree_id) {
          this.beginTree = event.originalTarget.attributes.tree_id.value;
          console.log('begin id=', this.beginTree);
        }
      }
    }

  }

  dragEnd(event: any) {
    console.log('end id = ', this.endTree);
    this.moveElement(this.beginTree,this.endTree);
  }

  dragOver(event: any) {
    this.endTree =  -1;
    if (event.originalTarget) {
      if (event.originalTarget.attributes) {
        if (event.originalTarget.attributes.tree_id) {
          this.endTree = event.originalTarget.attributes.tree_id.value;
        }
      }
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'link'; // ставим тип курсора

  }



  moveElement(beginId: number, endId: number) {
    this.data.forEach ( treeElement => {
      if (treeElement.id.toString() == beginId.toString()) {
        treeElement.parentId = endId;
        
      }
    });

    console.log('this.data2', this.data);

    this.data = [...this.data];
    
  }



  



}
