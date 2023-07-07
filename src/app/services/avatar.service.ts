import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';


@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private http: HttpClient, public gr: GlobalRef) { }



  updateAvatarUserTable(curAvatar: any, id_user: number) {
    const data_avatar = { 'avatar': curAvatar, 'id_user' : id_user};
    console.log('data_avatar =', data_avatar);
    return this.http.post(this.gr.sUrlGlobal + 'avatar', data_avatar);
  }


  getStaffFromId(id_staff: number) {

    const params = new HttpParams()
          .set('get_staff', id_staff);

    return this.http.get(this.gr.sUrlGlobal + 'avatar', {params: params});
  }



  clearStaffUserTable(id_staff: number) {

    const params = new HttpParams()
                  .set('clear_staff', id_staff);
    return this.http.get(this.gr.sUrlGlobal + 'avatar', {params: params});
  }

}
