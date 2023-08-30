import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }

  getObjectInfo(id_object: number) {
    const params = new HttpParams()
         .set('get_object_info', id_object);
    return this.http.get(this.gr.sUrlGlobal + 'checklist', {params: params});
  }

  getNextNumber() {
    const params = new HttpParams()
         .set('get_next_number', 'get_next_number');
    return this.http.get(this.gr.sUrlGlobal + 'checklist', {params: params});
  }





/*
  insertFilter(filterName: string, field1: string, value1: string, field2: string, value2: string, dateBegin: string, dateEnd: string) {
    const sUrl = this.gr.sUrlGlobal + 'filters';
    const id_user = this.auth.getSessionUser().id_user;
    const params = {itisInsertFilter: "itisInsertFilter", field1: field1, value1: value1, 
                    field2: field2, value2: value2, dateBegin: dateBegin, 
                    dateEnd: dateEnd, id_user: id_user, filterName: filterName};
    return this.http.post(sUrl, params);
  }  
*/  

}
