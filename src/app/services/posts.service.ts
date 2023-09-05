import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalRef } from 'globalref';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private http: HttpClient, public gr: GlobalRef, private auth: AuthService) { }

  getPostReadWeapon(id_post: number) {
    const params = new HttpParams()
         .set('get_post_read_weapon', id_post);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }

  getPostReadSpecialMeans(id_post: number) {
    const params = new HttpParams()
         .set('get_post_read_specialmeans', id_post);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }
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

  getPostSpecialMeans(id_post: number) {
    const params = new HttpParams()
         .set('get_post_special_means', id_post);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }

  getPostWeapons(id_post: number) {
    const params = new HttpParams()
         .set('get_post_weapons', id_post);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }

  getPostPhotoName(id_post: number) {
    const params = new HttpParams()
         .set('get_post_photo_name', id_post);
    return this.http.get(this.gr.sUrlGlobal + 'posts', {params: params});
  }

  clearPhotoPost(id_post: number) {
    const params = new HttpParams()
         .set('clear_post', id_post);
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

  updateSpecialMeans(id_post: number, id_mtr: number, count: number = 0) {
    const sUrl = this.gr.sUrlGlobal + 'posts';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {update_special_means: 'update_special_means', id_post, id_mtr, count, id_user});
  }

  insertWeapons(id_post: number, id_mtr: number, boolChecked: boolean, count: number = 0) {
    const sUrl = this.gr.sUrlGlobal + 'posts';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {insert_weapons: 'insert_weapons', id_post, id_mtr, boolChecked, count, id_user});
  }

  updateWeapons(id_post: number, id_mtr: number, count: number = 0) {
    const sUrl = this.gr.sUrlGlobal + 'posts';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {update_weapons: 'update_weapons', id_post, id_mtr, count, id_user});
  }

  updatePhotoPost(photo_post: any, id_post: number, id_user: number) {
    const data_photo_post = {id_post: id_post, 'photo_post': photo_post, 'id_user' : id_user};
    console.log('data_photo_post =', data_photo_post);
    return this.http.post(this.gr.sUrlGlobal + 'posts', data_photo_post);
  }

  
  deletePost(id_post: number) {
    const sUrl = this.gr.sUrlGlobal + 'posts';
    const id_user = this.auth.getSessionUser().id_user;
    return this.http.post(sUrl, {delete_post: 'delete_post', id_post, id_user});
  }  


}
