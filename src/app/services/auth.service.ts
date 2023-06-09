import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GlobalRef} from '../../../globalref';
import { IUser, IOhrArchive } from '../interface/auth/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService implements IUser, IOhrArchive {

  id = 0;
  name = '';
  curUserMariaID = 0;
  curOhrLogin = '';
  curOhrConnected = false;
  password = ''; 
  email = ''; 
  fio = ''; 
  bitdelete = false; 
  organization = '';

  constructor(private http: HttpClient, public gr: GlobalRef) { 
  }


  public getLoggedIn() {


      let curOhrConnected = localStorage.getItem('curOhrConnected');
      // curOhrConnected = curOhrConnected !== null ? JSON.parse(curOhrConnected): Boolean;
      let boolOhrConnected = (curOhrConnected?.toLowerCase() === "true"); 

      return boolOhrConnected;
  }

  getNickUserTable(nick: string) {
    const params = new HttpParams()
      .set('get_nick_user', nick.toString());
    return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
  }

  // получаем пользователя по почтовому адресу
  getEmailUserTable(email: string) {
    const params = new HttpParams()
      .set('get_email_user', email.toString());
    return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
  }

  setNewUser(NewUser: IUser, curSubject: String, curLetter: String) {
    // вставить запрос по добавлению пользователя в базу
    const user = { newuser : NewUser, subject: curSubject, letter: curLetter};
    return this.http.post(this.gr.sUrlGlobal + 'users', user);
  }

  // заносим текущего пользователя в локальное хранилище
  public setStorage(curOhrLogin: string, curOhrConnected: boolean, curUserMariaID: string) {
    window.localStorage.setItem('curOhrLogin', curOhrLogin);
    window.localStorage.setItem('curOhrConnected', JSON.stringify(curOhrConnected));
    window.localStorage.setItem('curUserMariaID', JSON.stringify(curUserMariaID));
  }


  public getStorage(): {curOhrLogin: string, curOhrConnected: boolean, curUserMariaID: string} {
    const curOhrLogin = window.localStorage.getItem('curOhrLogin') || '{}';
    const curOhrConnected = (window.localStorage.getItem('curOhrConnected') === 'true');
    const curUserMariaID = window.localStorage.getItem('curUserMariaID') || '{}';
    return {curOhrLogin: curOhrLogin, curOhrConnected: curOhrConnected, curUserMariaID: curUserMariaID};
  }


  // стираем текущего пользователя из локального хранилища
  public clearStorage() {
    window.localStorage.setItem('curOhrLogin', '');
    window.localStorage.setItem('curOhrConnected', JSON.stringify(false));
    window.localStorage.setItem('curUserMariaID', JSON.stringify(-1));
  }

  public getSchoolArchive() {
    return JSON.parse(window.localStorage.getItem('ohrarchive') || '{}');
  }


  // получаем пользователя, поиск по 2 полям - его почте и нику одновременно
  getUserFromBase(UserName: string) {
    const params = new HttpParams()
      .set('get_user', UserName.toString());
    return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
  }

  // получаем пользователя, поиск по mongo-ID
  getUserFromID(mariaID: string) {
    const params = new HttpParams()
      .set('get_user_id', mariaID.toString());
    return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
  }

  // получаем пользователя, поиск по mongo-ID
  getUserWithoutID(mongoID: string) {
    const params = new HttpParams()
      .set('get_user_withoutcurrentid', 'get_user_withoutcurrentid')
      .set('id_user', mongoID.toString());
    return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
  }


  sendPassword(email: string, pwd: string, hash: string) {
    const sUrl = this.gr.sUrlGlobal + 'forgotpassword';
    return this.http.post(sUrl, {email, pwd, hash});
  }

  // получаем пользователя, поиск по mongo-ID
  getUserFromSchool(filial: string, fio: string, slogin: string) {
    const params = new HttpParams()
      .set('get_user_ohr', 'get_user_ohr')
      .set('filial', filial)
      .set('fio', fio)
      .set('slogin', slogin);
    return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
  }


}
