import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
   private socket: Socket;

   constructor() {
    this.socket = io('http://localhost:5000');
  }

  // EMITTER example
  sendMessage(msg: string) {
    this.socket.emit('sendMessage', { message: msg });
  }

  // HANDLER example
  onNewMessage() {
    return new Observable(observer => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }


}
