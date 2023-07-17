import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }


  getStaff_All() {
    const params = new HttpParams()
      .set('get_staff', 'get_staff');
    return this.http.get(this.gr.sUrlGlobal + 'staff', {params: params});
  }


  updateProtectedSmallGuide(id_smallguide: number, text_guide: string, id_staff: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'staff';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {itis_smallguide: 'itis_smallguide', id_smallguide, text_guide, id_staff, field, id_user});
  }

  updateStaffOne(text: string, id_staff: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'staff';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {text, id_staff, field, id_user});
  }

  updateStaffDate(date: Date | null, id_staff: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'staff';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {date, id_staff, field, id_user});
  }


  updateStaffDateNull(id_staff: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'staff';
    const pNull = 'pNull';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {pNull, id_staff, field, id_user});
  }


}
