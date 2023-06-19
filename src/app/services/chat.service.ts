import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  
import { IDocChat } from '../interface/chat/chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }



  sengMessageAddUser(id_user: number) {
	console.log('user=', id_user);
	this.socket.emit('sigma_adduser', id_user);
} 



  	// emit event
	sengMessage(msg: IDocChat) {
		console.log('msg=', msg);
		this.socket.emit('sigma_message', msg);
	} 

	// listen event
	onMessage() {
		return this.socket.fromEvent('sigma_message');
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

