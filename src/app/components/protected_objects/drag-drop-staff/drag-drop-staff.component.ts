import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { ICard } from 'src/app/interface/staff/drag-drop-staff';
import { DragDropStaffService } from 'src/app/services/drag-drop-staff.service';
import { Observable, forkJoin } from 'rxjs';
import { GlobalRef } from 'globalref';
import { ActivatedRoute } from '@angular/router';

interface IDDResult {
  head: string;
  id_object: number;
  address: string;
  items: ICard[];
}

interface IObj {
  id: number;
  name: string;
  address: string;
}

@Component({
  selector: 'app-drag-drop-staff',
  templateUrl: './drag-drop-staff.component.html',
  styleUrls: ['./drag-drop-staff.component.css']
})
export class DragDropStaffComponent {

  //dd_array = [100  , 103, 107, 108];
  dd_result: IDDResult[] = [];

  dd_array: IObj[] = [];


  constructor(private dds: DragDropStaffService, private gr: GlobalRef, private route: ActivatedRoute) { 

   }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const dd_param: number[] = JSON.parse(params['navSettings']);
      const strParam = dd_param.join(',');
      
       this.dds.getDDProtObj(strParam).subscribe( (res: any) => {
        console.log('res=', res);
         this.dd_array = res;
         this.loadData();
       });

      }
    );    
  
   
  }


  loadData() {
    let sources: Observable<any>[] = [];
    for (let i = 0; i < this.dd_array.length; i++) {
      sources.push(this.dds.getDragDrop(this.dd_array[i].id))
    }

    forkJoin(sources)
    .subscribe(dataArray => {
        
          for (let i = 0; i < this.dd_array.length; i++) {
            let itemRes: ICard[] = [];
                dataArray[i].map( (val: ICard) => {
                  if (!val.photo_name) val.photo_name="/assets/img/usernull.jpg"; else val.photo_name= this.gr.sUrlAvatarGlobal+ val.photo_name;
                  itemRes.push(val);
                });
            this.dd_result.push( {head: this.dd_array[i].name, id_object: this.dd_array[i].id, address: this.dd_array[i].address, items: itemRes});
          }

    });
  }

  
  dropColumns(event: CdkDragDrop<string[]>) {
    //console.log(event.previousIndex, event.currentIndex);
    //moveItemInArray(this.dd_result, event.previousIndex, event.currentIndex);
  }


  drop(event: CdkDragDrop<ICard[]>, head: string, id_object: number) {
    this.dds.drop(event, head, id_object);
  }

//onDrop(event: CdkDragDrop< ICard[]>) {
//    this.dds.drop(event);
//  }  

onClose() {
  window.close();
}

}
