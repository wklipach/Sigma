import { Injectable } from '@angular/core';
import { IDocChat } from '../interface/chat/chat';
import { Observable, Subject, from, map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


	private countUnreadMessages = new Subject<number>();



  constructor(private http: HttpClient, public gr: GlobalRef) { 
  
  }
  


  isCountUnreadMessagesIn(): Observable<number> {
    return this.countUnreadMessages.asObservable();
  }

  isWriteCountUnreadMessages(count: number) {
    this.countUnreadMessages.next(count);
  }



  sengMessageAddUser(id_user: number) {
	const params = {sigma_adduser: id_user};
	return this.http.post(this.gr.sUrlGlobal + 'pooling_chat', params);
 } 

  

   sengReadMessage(id_user: number, id_user_to: number, createdAt: number) {
   	const params = {sigma_readmessage: 'sigma_readmessage', id_user: id_user, id_user_to: id_user_to, createdAt: createdAt};
	return this.http.post(this.gr.sUrlGlobal + 'pooling_chat', params);
   } 


	 checkAllUser(id_user: number) {
		const params = new HttpParams()
		.set('sigma_users', id_user);
	   return this.http.get(this.gr.sUrlGlobal + 'pooling_chat', {params: params});
	} 



  	// emit event
	sengMessage(msg: IDocChat) {
		const params = {insert_message: 'insert_message', msg: msg};
		return this.http.post(this.gr.sUrlGlobal + 'pooling_chat', params);

	} 

	// listen event
	getMessage() {
		const params = new HttpParams()
		.set('sigma_message', 'sigma_message');
	   return this.http.get(this.gr.sUrlGlobal + 'pooling_chat', {params: params})  as Observable<IDocChat[]>;
	}



	onStartMessage() {
 		const params = new HttpParams()
  		.set('sigma_start', 'sigma_start');
         return this.http.get(this.gr.sUrlGlobal + 'pooling_chat', {params: params})  as Observable<IDocChat[]>;
	}

}

