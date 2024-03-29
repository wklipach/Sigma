import {  CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalRef } from 'globalref';
import { Subscription, timer } from 'rxjs';
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


   private _StartMessageSub!: Subscription;
   private _MessageReadSub!: Subscription;
   private _MessageSub!: Subscription;
   private _UsersSub!: Subscription;

   sGrayIcon: string = "/assets/img/circle_gray.png";
   sGreenIcon: string = "/assets/img/circle_green.png";
   sMarkedIcon: string = "/assets/img/double-checked.png";
   sUnMarkedIcon: string = "/assets/img/unmarked.png";
   sAvatar : string = "/assets/img/usernull.jpg";
   
  
  private _curChatUser = {} as IUserChat;
  get curChatUser() {
    return this._curChatUser;
  }
  set curChatUser(chatUser: IUserChat) {
      this._curChatUser =  chatUser;
  }


  //public resp_msg: IDocChat = {id_user: -1, id_user_to: -1, message: '', bMarked: false, createdAt: -1, from_to_color: false};
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


  constructor(private socketService: ChatService, 
              private auth: AuthService, 
              scrollDispatcher: ScrollDispatcher, 
              private gr: GlobalRef) { 
    this.chatForm  = new FormGroup({
      'send_message': new FormControl('')
    });

  }

  ngOnInit(): void {


    this.currentUser = this.auth.getSessionUser(); 

    //получение аватара из базы
    this.auth.getUserAvatar(this.currentUser.id_user).subscribe ( (res: any) => {
            if (res.length>0) {
              if (res[0].ItIsAvatar>0) {
                this.sAvatar = this.gr.sUrlAvatarGlobal+res[0].avatar_name;
              }
            }
    });




    //получаем все пользователей в системе
    this.auth.getUserWithoutID(this.auth.getSessionUser().id_user).subscribe((data: any) => {
      
         this.users = data.map( (elem: any) => {
              const res_elem: IUserChat =  {id_user: elem.id, 
                                            name: elem.login, 
                                            connected: false, 
                                            ItIsAvatar: elem.ItIsAvatar, 
                                            connected_icon: this.sGrayIcon, 
                                            ItIsUnread: false};

              if ( Number(res_elem.ItIsAvatar)>0) {
                res_elem.avatar_name = this.gr.sUrlAvatarGlobal+ elem.avatar_name;
              } else {
                res_elem.avatar_name ="/assets/img/usernull.jpg";
              }
              return res_elem;
         });

      });


      // добавляем юзера в хранилище
      this.socketService.sengMessageAddUser(this.currentUser.id_user).subscribe( users => {
        //console.log('users', users);
      }

      );

    
    //инициализируем начальный список сообщений
    this._StartMessageSub =    this.socketService.onStartMessage().subscribe((data: IDocChat[] ) =>  { 
      //console.log('data=', data);
        this.allMessages = data.filter( (msg: any) => { return (msg.id_user === this.currentUser.id_user || msg.id_user_to === this.currentUser.id_user) })
                                                  .sort( (b: IDocChat, a: IDocChat) => {return b.createdAt - a.createdAt});

             //если отправленное тек. юзером ставим msg_rom_current_user true, else false 
             this.allMessages.forEach ( (el: IDocChat) => {
              if (el.id_user === this.currentUser.id_user) 
                  el.msg_from_current_user = true; else el.msg_from_current_user = false;
              });


              this.countUnreadMessage();
    });


    // НАЧАЛО бесконечный таймер красим зеленым активных пользователей 
    let timer$ = timer(2000, 3000);
    this._UsersSub =  timer$.subscribe(t => this.activeUsers());
    // КОНЕЦ бесконечный таймер красим зеленым активных пользователей 

    // НАЧАЛО бесконечный таймер получаем сообщения
    let timerMessage$ = timer(5000, 3000);
    this._MessageSub =  timerMessage$.subscribe(t => this.allMessage());
    // КОНЕЦ бесконечный таймер получаем сообщения

  }


   allMessage() {
    this.socketService.getMessage().subscribe( (data: any) =>  {
      this.allMessages = data.filter( (msg: any) => { return (msg.id_user === this.currentUser.id_user || msg.id_user_to === this.currentUser.id_user) })
                                                .sort( (b: any,a: any) => {return b.createdAt - a.createdAt});


      //перебираем полученные                                                     
      this.allMessages.forEach ( (el: IDocChat) =>  {
        //если отправленное тек. юзером ставим msg_rom_current_user true, else false                                             
        if (el.id_user === this.currentUser.id_user) el.msg_from_current_user = true; else el.msg_from_current_user = false;
        //сообщение прочитанное или нет, ставим иконку прочитанности
        if (el.bMarked) el.marked_icon = this.sMarkedIcon; else el.marked_icon = this.sUnMarkedIcon; 
      });
      this.showMessages(this.curChatUser.id_user);                                                        
      });    
    }

    activeUsers () {
        this.socketService.checkAllUser(this.currentUser.id_user).subscribe( (data: any) => {
            this.chatUsers = data;
            this.activeUser();
         }
        );
     }        


  ngOnDestroy() {
    //this._StartMessageSub.unsubscribe();
    //this._MessageReadSub.unsubscribe();

    if (this._MessageSub) {
       this._MessageSub.unsubscribe();
    }

    if (this._UsersSub) {
        this._UsersSub.unsubscribe();
    }

  }
 


  // Отправить сообщение  
  sendMessage(): void {


    if (!this.curChatUser.id_user) return;
    if (!String(this.chatForm.controls['send_message'].value).trim()) return;
    
    const send_msg: IDocChat = {
                                  id_user: this.currentUser.id_user, 
                                  id_user_to: this.curChatUser.id_user, 
                                  message: String(this.chatForm.controls['send_message'].value).trim(), 
                                  bMarked: false,
                                  createdAt: -1,
                                  msg_from_current_user: true,
                                  marked_icon: this.sUnMarkedIcon};

    this.socketService.sengMessage(send_msg).subscribe( () => {
      this.allMessage(); 
      this.chatForm.controls['send_message'].setValue('');
    });

  }


    activeUser() {
      // выключаем всех юзеров
        this.users.map((user) => {
          user.connected = false;
          user.connected_icon = this.sGrayIcon;
        });

        //включаем найденных как активных 
        for (const [key, value] of Object.entries(this.chatUsers)) {
            let userIndex = this.users.findIndex( user => user.id_user.toString() == key);
            if (userIndex > -1) {
                this.users[userIndex].connected = true;
                this.users[userIndex].connected_icon = this.sGreenIcon;
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

      //все что послано кем-то нам делаем прочитанным => sMarkedIcon 
      Res.forEach ( (el: IDocChat) => {
        if (el.bMarked) el.marked_icon = this.sMarkedIcon; else el.marked_icon = this.sUnMarkedIcon; 
        if (el.id_user !== this.currentUser.id_user && el.bMarked === false) {
          el.bMarked = true;
          el.marked_icon = this.sMarkedIcon; 
          //console.log(el);
          //отправляем сведения о прочитанном сообщении
          this.socketService.sengReadMessage(el.id_user, el.id_user_to, el.createdAt).subscribe();
        }

      });

      this.countUnreadMessage();      

      if (JSON.stringify(this.appearMessages) !== JSON.stringify(Res)) {
            this.appearMessages = [...Res];
            this._scrollToBottom();
      }
      
    }


    private _scrollToBottom() {
      setTimeout(() => {
        this.virtualScroll.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 0);
      setTimeout(() => {
        this.virtualScroll.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 50);
    } 
    
   
    getClassLine(bTrue: boolean) {
       if (bTrue) 
          return "example-item"; 
        else 
          return "example-item-false";
   }




   //пересчитываем сколько непрочитанных сообщений у юзера
   countUnreadMessage() {
    //console.log('allMessages = ', this.allMessages);
     let res = this.allMessages.filter( el => el.id_user !== this.currentUser.id_user).filter( el => el.bMarked == false);


     this.socketService.isWriteCountUnreadMessages(res.length);

      res = res.reduce((o: IDocChat[], i: IDocChat) => {
      if (!o.find(v => v.id_user == i.id_user)) {
        o.push(i);
      }
      return o;
    }, []);


    //console.log('000000====>', res);  

    this.users.forEach ( el=> { el.ItIsUnread = false; });
    res.forEach ( el => {
      this.users.find( user=> user.id_user == el.id_user)!.ItIsUnread = true;  

      //console.log('====>', this.users.find( user=> user.id_user == el.id_user));  

    });

    this.users = [...this.users];
    //console.log('this.users', this.users);

     
   }
   

  
}
