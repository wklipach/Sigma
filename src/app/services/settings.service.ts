import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }

  getSetting(id_staff: number) {
    const params = new HttpParams()
      .set('get_current_settings', id_staff.toString());

    return this.http.get(this.gr.sUrlGlobal + 'settings', {params: params});
  }

  getSettingProtectedObject(id_staff: number) {
    const params = new HttpParams()
      .set('get_settings_protected_object', id_staff.toString());
    return this.http.get(this.gr.sUrlGlobal + 'settings', {params: params});
  }

  setSettingDeleteProtectedObject(id: number, id_object: number, id_staff: number) {

    const id_user = this.auth.getSessionUser().id_user;
    const params = {
     settings_delete_protected_object: id.toString(),
     id_object: id_object, 
     id_staff:  id_staff,
     id_user:   id_user
    }

    return this.http.post(this.gr.sUrlGlobal + 'settings', params);
  }

   setInsertProtectedObject(id_object: string, id_staff: number) {
    const id_user = this.auth.getSessionUser().id_user;
    const params = {
     settings_insert_protected_object: 'settings_insert_protected_object',
     id_object: id_object, 
     id_staff:  id_staff,
     id_user:   id_user
    }


    return this.http.post(this.gr.sUrlGlobal + 'settings', params);
  }

  setUpdateProtectedObject(id: number, id_object: string, id_staff: number) {
    const id_user = this.auth.getSessionUser().id_user;
    const params = {
     settings_update_protected_object: id,
     id_object: id_object, 
     id_staff:  id_staff,
     id_user:   id_user
    }
    return this.http.post(this.gr.sUrlGlobal + 'settings', params);
  }

  

}
