import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {Observable} from 'rxjs';
import { GlobalRef } from 'globalref';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
   private socket: Socket;

   constructor(public gr: GlobalRef) {
    this.socket = io(gr.lobbychat);
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
