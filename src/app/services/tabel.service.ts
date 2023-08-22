import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class TabelService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }


  getStaff_All() {
    const params = new HttpParams()
      .set('get_tabel', 'get_tabel');
    return this.http.get(this.gr.sUrlGlobal + 'tabel', {params: params});
  }
  
}
