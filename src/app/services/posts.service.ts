import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }

  getPosts(id_object: number) {
    const params = new HttpParams()
         .set('get_posts', 'get_posts')
         .set('id_object', id_object);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }


  insertPost(id_object: number) {
    const sUrl = this.gr.sUrlGlobal + 'posts';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {insert_post: 'insert_post', id_object, id_user});
  }


}
