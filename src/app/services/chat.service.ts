import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  
import { IDocChat } from '../interface/chat/chat';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


	private countUnreadMessages = new Subject<number>();



  constructor(private socket: Socket) { 
  
  }


  isCountUnreadMessagesIn(): Observable<number> {
    return this.countUnreadMessages.asObservable();
  }

  isWriteCountUnreadMessages(count: number) {
    this.countUnreadMessages.next(count);
  }



  sengMessageAddUser(id_user: number) {
	this.socket.emit('sigma_adduser', id_user);
 } 

  sengStartMessage() {
	this.socket.emit('sigma_start', 'sigma_start');
   } 


   sengReadMessage(id_user: number, id_user_to: number, createdAt: number) {
	this.socket.emit('sigma_readmessage', {id_user, id_user_to, createdAt});
 } 


   	// emit event
	 checkAllUser(s: string) {
		console.log('sigma_users', s);
		this.socket.emit('sigma_users', s);
	} 



  	// emit event
	sengMessage(msg: IDocChat) {
		this.socket.emit('sigma_message', msg);
	} 

	// listen event
	onMessage() {
		return this.socket.fromEvent('sigma_message') as Observable<IDocChat[]>;
	}

	// listen event ReadMessage
	onMessageRead() {
		return this.socket.fromEvent('sigma_readmessage') as Observable<IDocChat[]>;
	}


	onStartMessage() {
		return this.socket.fromEvent('sigma_start') as Observable<IDocChat[]>;
	}

    // listen event
	 onUsers() {
		return	this.socket.fromEvent('sigma_users') as Observable<any[]>;
    }

	    // listen event
     onDisconnect() {
		this.socket.disconnect();
		}
	
	
}

