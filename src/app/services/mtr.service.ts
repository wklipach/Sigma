import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class MtrService {

  constructor(private http: HttpClient, public gr: GlobalRef) { }


  getMTR() {
    const params = new HttpParams()
      .set('get_mtr', 'get_mtr');
    return this.http.get(this.gr.sUrlGlobal + 'mtr', {params: params});
  }



}
