import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ListobjectsService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }


  getProtectedObjectsOne() {
    const params = new HttpParams()
      .set('get_protected_objects', 'get_protected_objects');
    return this.http.get(this.gr.sUrlGlobal + 'protected_objects', {params: params});
  }


  updateProtectedOne(text: string, id_object: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {text, id_object, field, id_user});
  }


  updateProtectedSmallGuide(text: string, id_object: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'protected_objects';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {text, id_object, field, id_user});
  }

}
