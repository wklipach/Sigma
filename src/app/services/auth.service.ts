import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GlobalRef} from '../../../globalref';
import { IUser, IOhrArchive, ISessionUser } from '../interface/auth/user';


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


  _id_user: number = -1;
  _name: string = '';
  _email = ''; 
  _fio = '';
  _organization = '';

  public getSessionUser(): ISessionUser {


    if (window.localStorage.getItem('sUser') && (this._id_user === -1) )  {
      const sUser: ISessionUser = JSON.parse(window.localStorage.getItem('sUser') || "{id_user: -1, name: '', email: '', fio: '', organization: ''}");
      this._id_user = sUser.id_user;
      this._name = sUser.name;
      this._email = sUser.email;
      this._fio = sUser.fio;
      this._organization = sUser.organization;
      }

    const user: ISessionUser = {id_user: this._id_user, name: this._name, email: this._email, fio: this._fio, organization: this._organization};
    return user;
  } 

  public setSessionUser(sUser: ISessionUser) {
    this._id_user = sUser.id_user;
    this._name = sUser.name;
    this._email = sUser.email;
    this._fio = sUser.fio;
    this._organization = sUser.organization;

    window.localStorage.setItem('sUser', JSON.stringify(sUser));

  } 

  

  constructor(private http: HttpClient, public gr: GlobalRef) { 
  }


  
  public getNumberIn() {
    let curNumber = localStorage.getItem('number');
    curNumber = curNumber !== null ? JSON.parse(curNumber): Boolean;
    let boolNumber = (curNumber?.toString().toLowerCase() === "true"); 
    return boolNumber;
}



  public getLoggedIn() {
      let curOhrConnected = localStorage.getItem('curOhrConnected');
      // curOhrConnected = curOhrConnected !== null ? JSON.parse(curOhrConnected): Boolean;
      let boolOhrConnected = (curOhrConnected?.toLowerCase() === "true") && (this.getSessionUser().id_user?.toString()!=="-1"); 
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


  public setNumber() {
    window.localStorage.setItem('number', JSON.stringify('true'));
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
    window.localStorage.setItem('number', JSON.stringify(false));
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

  // получаем пользователя, поиск по maria DB
  getUserFromID(mariaID: string) {
    const params = new HttpParams()
      .set('get_user_id', mariaID.toString());
    return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
  }

  // получаем пользователя, поиск по mongo-ID
  getUserWithoutID(id_user: number) {
    const params = new HttpParams()
      .set('get_user_withoutcurrentid', 'get_user_withoutcurrentid')
      .set('id_user', id_user.toString());

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


    // получаем аватар пользователя
    getUserAvatar(id_user: number) {
      const params = new HttpParams()
        .set('get_user_avatar', id_user);
      return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
    }
 

    // получаем количество непрочитанных сообщений в чате
    getCountMessages(id_user: number) {
      const params = new HttpParams()
        .set('get_count_messages', id_user);
      return this.http.get(this.gr.sUrlGlobal + 'users', {params: params});
    }

    


}
