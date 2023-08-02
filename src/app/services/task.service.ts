import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }


  getTask_All() {
    const params = new HttpParams()
      .set('get_task', 'get_task');
    return this.http.get(this.gr.sUrlGlobal + 'task', {params: params});
  }


  insertTask(id_object: number, id_department: number, note: string, date_begin: string, date_end: string) {
    const sUrl = this.gr.sUrlGlobal + 'task';
    const id_user = this.auth.getSessionUser().id_user;
    const params = {insert_task: 'insert_task', 
                    id_object: id_object, 
                    id_department: id_department, 
                    note: note,
                    date_begin: date_begin,
                    date_end: date_end,
                    id_user: id_user                  
                  };
    return this.http.post(sUrl, params);
  }


}
