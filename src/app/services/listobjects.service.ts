import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListobjectsService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }



  clearPhotoObject(id_object: number) {

    const params = new HttpParams()
                  .set('clear_object', id_object);
    return this.http.get(this.gr.sUrlGlobal + 'protected_objects', {params: params});
  }

  updatePhotoObject(imageObject: any, id_object: number) {
    const data_object = { 'imageObject': imageObject, 'id_object' : id_object};
    return this.http.post(this.gr.sUrlGlobal + 'protected_objects', data_object);
  }



  getProtectedObjectsOne() {
    const params = new HttpParams()
      .set('get_protected_objects', 'get_protected_objects');
    return this.http.get(this.gr.sUrlGlobal + 'protected_objects', {params: params});
  }

  getCurrentProtectedObjects(id_object: number) {
    const params = new HttpParams()
      .set('get_current_objects', id_object);
    return this.http.get(this.gr.sUrlGlobal + 'protected_objects', {params: params});
  }



  updateProtectedOne(text: string, id_object: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {text, id_object, field, id_user});
  }


  addObject(text_name: string) {
    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {addObject: 'addObject', id_user, text_name});
  }

  deleteObject(id_object: string) {
    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {deleteObject: 'deleteObject', id_object, id_user});
  }


  updateProtectedDate(date: Date | null, id_object: string, field: string) {

    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {date, id_object, field, id_user});
  }


  updateProtectedDateNull(id_object: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const pNull = 'pNull';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {pNull, id_object, field, id_user});
  }




  updateProtectedSmallGuide(id_smallguide: number, text_guide: string, id_object: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {itis_smallguide: 'itis_smallguide', id_smallguide, text_guide, id_object, field, id_user});
  }


}
