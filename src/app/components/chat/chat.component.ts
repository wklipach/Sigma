import {  CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ISessionUser } from 'src/app/interface/auth/user';
import { IDocChat, IUserChat } from 'src/app/interface/chat/chat';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
 
})

export class ChatComponent implements OnInit {

   @ViewChild('fareNotes') virtualScroll!: CdkVirtualScrollViewport;
   

  
 
  private _curChatUser = {} as IUserChat;
  get curChatUser() {
    return this._curChatUser;
  }
  set curChatUser(chatUser: IUserChat) {
      this._curChatUser =  chatUser;
  }


  public resp_msg: IDocChat = {id_user: -1, id_user_to: -1, message: '', bMarked: false, createdAt: -1};
  public chatUsers = {};

  // хранилище всех сообщений
  public allMessages: IDocChat[] = [];

  // сообщения юзера с которым общаемся которые покажет интерфейс
  public appearMessages: IDocChat[] = [];
  
  chatForm: FormGroup;
  currentUser: ISessionUser = {
    id_user: -1,
    name: '',
    email: '',
    fio: '',
    organization: ''
  };
  
  users: IUserChat[] = [];


  constructor(private socketService: ChatService, private auth: AuthService, scrollDispatcher: ScrollDispatcher) { 

    this.chatForm  = new FormGroup({
      'send_message': new FormControl('')
    });

  }

  ngOnInit(): void {

    this.currentUser = this.auth.getSessionUser(); 


    //получаем все пользователей в системе
    this.auth.getUserWithoutID(this.auth.getSessionUser().id_user).subscribe((data: any) => {

      this.users = data.map( (elem: any) => {
        return {id_user: elem.id, name: elem.login, connected: false};
      });


      this.socketService.sengMessageAddUser(this.currentUser.id_user);

    });



    
    //инициализируем начальный список сообщений
    this.socketService.sengStartMessage();
    this.socketService.onStartMessage().subscribe((data: IDocChat[]) =>  {
        this.allMessages = data.filter( (msg) => { return (msg.id_user === this.currentUser.id_user || msg.id_user_to === this.currentUser.id_user) })
                                                  .sort( (a,b) => {return b.createdAt - a.createdAt});
        }
    );


    //получение кем-то отправленных сообщений
    this.socketService.onMessage().subscribe((data: IDocChat[]) =>  {
              this.allMessages = data.filter( (msg) => { return (msg.id_user === this.currentUser.id_user || msg.id_user_to === this.currentUser.id_user) })
                                                        .sort( (a,b) => {return b.createdAt - a.createdAt});

              this.showMessages(this.curChatUser.id_user);                                                        
          }
     );

    this.socketService.onUsers().subscribe((data: any) =>  {
          this.chatUsers = data;

          // включаем и сортируем активных юзеров
          this.activeUser();
       }
    );


  }


  ngAfterViewInit() {
    // child is set
    if (this.virtualScroll) {


      this.virtualScroll.getElementRef

      this.virtualScroll.scrolledIndexChange.subscribe( e=> {
        console.log('e', e);
        const renderedRange = this.virtualScroll.getRenderedRange();
        console.log('renderedRange=', this.virtualScroll.getElementRef().nativeElement);

        

      });

      }




    }









  onMessage(): void {

    if (!this.curChatUser.id_user) return;
    if (!String(this.chatForm.controls['send_message'].value).trim()) return;
    
    const send_msg: IDocChat = {
                                  id_user: this.currentUser.id_user, 
                                  id_user_to: this.curChatUser.id_user, 
                                  message: String(this.chatForm.controls['send_message'].value).trim(), 
                                  bMarked: false,
                                  createdAt: -1};

    this.socketService.sengMessage(send_msg);

  }



    activeUser() {
      // выключаем всех юзеров
        this.users.map((user) => {
          user.connected = false;
        });

        //включаем найденных как активных 
        for (const [key, value] of Object.entries(this.chatUsers)) {
            let userIndex = this.users.findIndex( user => user.id_user == value);
            if (userIndex > -1) {
                this.users[userIndex].connected = true;
            }
          }

          //сортируем сначала по имени
          this.users.sort((x, y) => x.name.localeCompare(y.name));
          //сортируем по наличию подключения
          this.users.sort((x, y) => +y.connected - +x.connected);


          //перестраиваем массив
          this.users = [...this.users];
    }


    clickUser(user: IUserChat) {
        this.curChatUser = user;
        this.showMessages(this.curChatUser.id_user);

    }


    showMessages(curChatUser: number) {

      // если есть изменение в прямо сейчас показываемом юзере обновляем текущее окно. 
      const Res = this.allMessages.filter( (msg) => { return (msg.id_user === curChatUser || msg.id_user_to === curChatUser);});

      if (this.appearMessages.length !== Res.length) {
           this.appearMessages = Res;
      }

    }
    
}
