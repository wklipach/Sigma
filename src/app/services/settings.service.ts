import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient, public gr: GlobalRef) { }

  getSetting(id_staff: number) {
    const params = new HttpParams()
      .set('get_current_settings', id_staff.toString());


      console.log(params);

    return this.http.get(this.gr.sUrlGlobal + 'settings', {params: params});
  }

}
