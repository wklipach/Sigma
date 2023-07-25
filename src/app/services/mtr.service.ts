import { HttpClient, HttpParams } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';
import { Imtr } from '../interface/mtr/mtr';
import { Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MtrService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }



  
  getMTR(): Observable<Imtr[]>  {
    const params = new HttpParams()
      .set('get_mtr', 'get_mtr');
    return this.http.get<Imtr[]>(this.gr.sUrlGlobal + 'mtr', {params: params});
  }
  


  // var params = "'get_mtr='get_mtr&anothervariable=anothervalue";
  fetch(cb: any)  {
    const req = new XMLHttpRequest();
    var params = "get_mtr=get_mtr";
    req.open("GET", this.gr.sUrlGlobal + 'mtr'+"?"+params);    
    req.onload = () => {
      cb(JSON.parse(req.response));
    };
    req.send();
  }


  getMtrJson() {
    const params = new HttpParams()
      .set('get_mtr', 'get_mtr');
    return this.http.get(this.gr.sUrlGlobal + 'mtr', {params: params}).pipe(map((response: any) => response.json()));
    

  
  }




  /*
  getMTR() {
    const params = new HttpParams()
      .set('get_mtr', 'get_mtr');
    return this.http.get(this.gr.sUrlGlobal + 'mtr', {params: params});
  }
  */

  updateMtrOne(text: string, id_mtr: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'mtr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {text, id_mtr, field, id_user});
  }


  addMtr(text_name: string) {
    const sUrl = this.gr.sUrlGlobal + 'mtr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {addMtr: 'addMtr', id_user, text_name});
  }

  deleteMtr(id_mtr: string) {
    const sUrl = this.gr.sUrlGlobal + 'mtr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {deleteMtr: 'deleteMtr', id_mtr, id_user});
  }


  updateMtrDate(date: Date | null, id_mtr: string, field: string) {

    const sUrl = this.gr.sUrlGlobal + 'mtr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {date, id_mtr, field, id_user});
  }


  updateMtrDateNull(id_mtr: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'mtr';
    const pNull = 'pNull';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {pNull, id_mtr, field, id_user});
  }


  updateMtrSmallGuide(id_smallguide: number, text_guide: string, id_mtr: string, field: string) {
    const sUrl = this.gr.sUrlGlobal + 'mtr';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {itis_smallguide: 'itis_smallguide', id_smallguide, text_guide, id_mtr, field, id_user});
  }



}
