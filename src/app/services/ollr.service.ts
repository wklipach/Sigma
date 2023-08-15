import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OllrService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }

  getOllr(id_staff: number) {
    const params = new HttpParams()
         .set('get_ollr', 'get_ollr')
         .set('id_staff', id_staff);
    return this.http.get(this.gr.sUrlGlobal + 'ollr', {params: params});
  }


  deleteOllr(id_staff: number, id: number) {
    const sUrl = this.gr.sUrlGlobal + 'ollr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {delete_ollr: 'delete_ollr', id_staff, id, id_user});
  }

  closeOllr(id_staff: number, id: number) {
    const sUrl = this.gr.sUrlGlobal + 'ollr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {close_ollr: 'close_ollr', id_staff, id, id_user});
  }

  addOllr(id_staff: string, id_ollr: string, DateBegin: Date) {
    const sUrl = this.gr.sUrlGlobal + 'ollr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {add_ollr: 'add_ollr', id_staff, id_ollr, DateBegin, id_user});
  }

  

}
