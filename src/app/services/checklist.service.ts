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


  getListCheck() {
    const params = new HttpParams()
         .set('get_list_check', 'get_list_check');
    return this.http.get(this.gr.sUrlGlobal + 'checklist', {params: params});
  }


  getCheck(id_po_check: number) {
    const params = new HttpParams()
         .set('get_check', id_po_check);
    return this.http.get(this.gr.sUrlGlobal + 'checklist', {params: params});
  }

  getCheckTittleInfo(id_po_check: number) {
    const params = new HttpParams()
         .set('get_tittle_info', id_po_check);
    return this.http.get(this.gr.sUrlGlobal + 'checklist', {params: params});
  }




  insertCheckList(id_object: number,  
                   dateBegin: Date,  
                   dateEnd: Date,  
                   id_check_senjor: number,  
                   elements_object: any, 
                   average_grade: number,
                   count_trouble: number) {
    const sUrl = this.gr.sUrlGlobal + 'checklist';
    const id_user = this.auth.getSessionUser().id_user;
    const params = {insert_checklist: "insert_checklist", 
                    id_object,  
                    dateBegin,  
                    dateEnd, 
                    id_check_senjor, 
                    elements_object,
                    average_grade,
                    count_trouble,
                    id_user};

    return this.http.post(sUrl, params);
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
