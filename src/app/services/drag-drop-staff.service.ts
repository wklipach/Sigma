import { Injectable } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ICard } from '../interface/staff/drag-drop-staff';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';


interface IObj {
  id: number;
  name: string;
}



@Injectable({
  providedIn: 'root'
})
export class DragDropStaffService {

  private dd_protected_objects: IObj[] = [];

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService ) { }

  public setDDProtectedObjects(selected: []) {
    this.dd_protected_objects = [];

    selected.map( (el: any) => {
      this.dd_protected_objects.push({id: el.id_object, name: el.name })  ;
    } )

 }

  public getDDProtectedObjects() {
    return this.dd_protected_objects;
  }


  getDragDrop(id_object: number) {
    const params = new HttpParams()
         .set('get_dragdrop', id_object);
    return this.http.get(this.gr.sUrlGlobal + 'staff', {params: params});
  }

  drop(event: CdkDragDrop<ICard[]>, head: string, id_object: number) {


    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      let sourcheElement = event.previousContainer.data[event.previousIndex];
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      this.updateStaffObject(sourcheElement.id, id_object, sourcheElement.id_staff).subscribe();

    }

  }

  updateStaffObject(id_so: number, id_object: number, id_staff: number) {

    const id_user = this.auth.getSessionUser().id_user;
    const params = {'update_dragdrop': 'update_dragdrop', id_so, id_object, id_staff, id_user };
    return this.http.post(this.gr.sUrlGlobal + 'staff', params);

      
  }

}
