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


  
  getObjectFromPost(id_post: number) {
    const params = new HttpParams()
         .set('get_object_from_post', 'get_object_from_post')
         .set('id_post', id_post);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }

  getPostBase(id_post: number) {
    const params = new HttpParams()
         .set('get_post_base', 'get_post_base')
         .set('id_post', id_post);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }



  insertPost(id_object: number) {
    const sUrl = this.gr.sUrlGlobal + 'posts';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {insert_post: 'insert_post', id_object, id_user});
  }

  insertSpecialMeans(id_post: number, id_mtr: number, boolChecked: boolean, count: number = 0) {
    const sUrl = this.gr.sUrlGlobal + 'posts';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {insert_special_means: 'insert_special_means', id_post, id_mtr, boolChecked, count, id_user});
  }



}
