import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class TabelService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }


  getTabel_All() {
    const params = new HttpParams()
      .set('get_tabel', 'get_tabel');
    return this.http.get(this.gr.sUrlGlobal + 'tabel', {params: params});
  }

  setTabelDateBegin(date: Date, id: number) {
    const id_user = this.auth.getSessionUser().id_user;
    const params= {dateBegin: date, id, id_user};
    return this.http.post(this.gr.sUrlGlobal + 'tabel', params);
  }

  setTabelDateBeginNull(id: number) {
    const id_user = this.auth.getSessionUser().id_user;
    const params= {dateBeginNull: "null", id, id_user};
    return this.http.post(this.gr.sUrlGlobal + 'tabel', params);
  }

  setTabelDateEnd(date: Date, id: number) {
    const id_user = this.auth.getSessionUser().id_user;
    const params= {dateEnd: date, id, id_user};
    return this.http.post(this.gr.sUrlGlobal + 'tabel', params);
  }

  setTabelDateEndNull(id: number) {
    const id_user = this.auth.getSessionUser().id_user;
    const params= {dateEndNull: "null", id, id_user};
    return this.http.post(this.gr.sUrlGlobal + 'tabel', params);
  }
  

}
