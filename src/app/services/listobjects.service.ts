import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class ListobjectsService {

  constructor(private http: HttpClient, public gr: GlobalRef) { }


  getProtectedObjectsOne() {
    const params = new HttpParams()
      .set('get_protected_objects', 'get_protected_objects');
    return this.http.get(this.gr.sUrlGlobal + 'protected_objects', {params: params});
  }


}
