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


}
