import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';  
import { IDocChat } from '../interface/chat/chat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }



  sengMessageAddUser(id_user: number) {
	this.socket.emit('sigma_adduser', id_user);
} 

  sengStartMessage() {
	this.socket.emit('sigma_start', 'sigma_start');
   } 





  	// emit event
	sengMessage(msg: IDocChat) {
		console.log('msg=', msg);
		this.socket.emit('sigma_message', msg);
	} 

	// listen event
	onMessage() {
		return this.socket.fromEvent('sigma_message') as Observable<IDocChat[]>;
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

