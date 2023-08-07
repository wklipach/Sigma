import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  constructor(private http: HttpClient, public gr: GlobalRef) { }


  getStaffOne(id_staff: number) {
    const params = new HttpParams()
      .set('get_one_date', id_staff.toString());
    return this.http.get(this.gr.sUrlGlobal + 'summary', {params: params});
  }


  getObjectSenjor(id_staff: number) {
    const params = new HttpParams()
      .set('get_object_senjor', id_staff.toString());
    return this.http.get(this.gr.sUrlGlobal + 'summary', {params: params});
  }

  
  getCompany(id_staff: number) {
    const params = new HttpParams()
      .set('get_company', id_staff.toString());
    return this.http.get(this.gr.sUrlGlobal + 'summary', {params: params});
  }  

  getOLLR(id_staff: number) {
    const params = new HttpParams()
      .set('get_ollr', id_staff.toString());
    return this.http.get(this.gr.sUrlGlobal + 'summary', {params: params});
  }  

  getCurrentOLLR(id_staff: number) {
    const params = new HttpParams()
      .set('get_current_ollr', id_staff.toString());
    return this.http.get(this.gr.sUrlGlobal + 'summary', {params: params});
  }  


  



}
