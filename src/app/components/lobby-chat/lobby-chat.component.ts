import { Component, ViewEncapsulation } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';


@Component({
  selector: 'app-lobby-chat',
  templateUrl: './lobby-chat.component.html',
  styleUrls: ['./lobby-chat.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class LobbyChatComponent {

  msgInput: string = 'lorem ipsum';

  constructor(private socket: SocketService) {
  }

  ngOnInit() {
    this.socket.onNewMessage().subscribe((msg: any) => {
      console.log('got a msg: ',  new Date(msg.createdAt));
    });
  }

  sendButtonClick() {
    this.socket.sendMessage(this.msgInput);
  }

    

}
