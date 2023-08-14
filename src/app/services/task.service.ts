import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }


  getTask_All() {
    const id_user = this.auth.getSessionUser().id_user;
    const params = new HttpParams()
      .set('get_task', id_user);
    return this.http.get(this.gr.sUrlGlobal + 'task', {params: params});
  }


  insertTask(id_object: number, name_task: string, id_department: number, note: string, date_begin: string, date_end: string) {
    const sUrl = this.gr.sUrlGlobal + 'task';
    const id_user = this.auth.getSessionUser().id_user;
    const params = {insert_task: 'insert_task', 
                    id_object: id_object,
                    name_task: name_task, 
                    id_department: id_department, 
                    note: note,
                    date_begin: date_begin,
                    date_end: date_end,
                    id_user: id_user                  
                  };
    return this.http.post(sUrl, params);
  }

  deleteTask(id_task: string) {
    const sUrl = this.gr.sUrlGlobal + 'task';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {deleteTask: 'deleteTask', id_task, id_user});
  }

  succesfullTask(id_task: string) {
    const sUrl = this.gr.sUrlGlobal + 'task';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {succesfullTask: 'succesfullTask', id_task, id_user});
  }

  acceptTask(id_task: string) {
    const sUrl = this.gr.sUrlGlobal + 'task';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {acceptTask: 'acceptTask', id_task, id_user});
  }

  unAceptTaskCount() {
    const sUrl = this.gr.sUrlGlobal + 'task';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {unAceptTaskCount: 'unAceptTaskCount', id_user});
  }


  public countTask$ = new Subject<number>();

		public changeCount(count: number) {
   		this.countTask$.next(count); 
  }

}
