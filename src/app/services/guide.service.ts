import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class GuideService {

  constructor(private http: HttpClient, public gr: GlobalRef) { }

  getSmallGuide(guidename: string) {
    const params = new HttpParams()
         .set('get_small_guide', guidename);
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }

  getSenjorGuard() {
    const params = new HttpParams()
         .set('get_senjor_guard', 'get_senjor_guard');
    return this.http.get(this.gr.sUrlGlobal + 'guide', {params: params});
  }

  
}
