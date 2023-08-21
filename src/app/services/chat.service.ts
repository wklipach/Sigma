import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  
import { IDocChat } from '../interface/chat/chat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { 
  
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
		return	this.socket.fromEvent('sigma_users');
    }

	    // listen event
     onDisconnect() {
		this.socket.disconnect();
		}
	
	
}

