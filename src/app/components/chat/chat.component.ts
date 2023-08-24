import {  CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GlobalRef } from 'globalref';
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

      this.socketService.sengMessageAddUser(this.currentUser.id_user);

    
    //инициализируем начальный список сообщений
    this.socketService.sengStartMessage();
    this.socketService.onStartMessage().subscribe((data: IDocChat[]) =>  {
        this.allMessages = data.filter( (msg) => { return (msg.id_user === this.currentUser.id_user || msg.id_user_to === this.currentUser.id_user) })
                                                  .sort( (b,a) => {return b.createdAt - a.createdAt});

             //если отправленное тек. юзером ставим msg_rom_current_user true, else false 
             this.allMessages.forEach ( (el: IDocChat) => {
              if (el.id_user === this.currentUser.id_user) 
                  el.msg_from_current_user = true; else el.msg_from_current_user = false;
              });


              this.countUnreadMessage();
    });




       //если пришло сообщение что какие-то сообщения прочитаны обновляем список сообщений
       this.socketService.onMessageRead().subscribe((data: IDocChat[]) =>  {

                      this.allMessages = data.filter( (msg) => { return (msg.id_user === this.currentUser.id_user || msg.id_user_to === this.currentUser.id_user) })
                                                                 .sort( (b,a) => {return b.createdAt - a.createdAt});
                      //перебираем полученные                                                     
                      this.allMessages.forEach ( (el: IDocChat) =>  {
                      //если отправленное тек. юзером ставим msg_rom_current_user true, else false                                             
                      if (el.id_user === this.currentUser.id_user) el.msg_from_current_user = true; else el.msg_from_current_user = false;
                      //сообщение прочитанное или нет, ставим иконку прочитанности
                      if (el.bMarked) el.marked_icon = this.sMarkedIcon; else el.marked_icon = this.sUnMarkedIcon; 

                      });
                      this.showMessages(this.curChatUser.id_user);                                                        
        });



        //получение кем-то отправленных сообщений, включая самого юзера
        this.socketService.onMessage().subscribe((data: IDocChat[]) =>  {
                        this.allMessages = data.filter( (msg) => { return (msg.id_user === this.currentUser.id_user || msg.id_user_to === this.currentUser.id_user) })
                                                                  .sort( (b,a) => {return b.createdAt - a.createdAt});
                        //перебираем полученные                                                     
                        this.allMessages.forEach ( (el: IDocChat) =>  {
                          //если отправленное тек. юзером ставим msg_rom_current_user true, else false                                             
                          if (el.id_user === this.currentUser.id_user) el.msg_from_current_user = true; else el.msg_from_current_user = false;
                          //сообщение прочитанное или нет, ставим иконку прочитанности
                          if (el.bMarked) el.marked_icon = this.sMarkedIcon; else el.marked_icon = this.sUnMarkedIcon; 

                        });
                        this.showMessages(this.curChatUser.id_user);                                                        
        });

    this.socketService.onUsers().subscribe((data: any) =>  {
          this.chatUsers = data;

          // включаем и сортируем активных юзеров
          this.activeUser();
       }
    );



  }


  ngAfterViewInit() {
    // child is set
    //if (this.virtualScroll) {
      // this.virtualScroll.getElementRef
      //this.virtualScroll.scrolledIndexChange.subscribe( e=> {
        //console.log('e', e);
        //const renderedRange = this.virtualScroll.getRenderedRange();
        ///console.log('renderedRange=', this.virtualScroll.getElementRef().nativeElement);
      //});
      //}

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

    this.socketService.sengMessage(send_msg);


  }


    activeUser() {
      // выключаем всех юзеров
        this.users.map((user) => {
          user.connected = false;
          user.connected_icon = this.sGrayIcon;
        });

        //включаем найденных как активных 
        for (const [key, value] of Object.entries(this.chatUsers)) {
            let userIndex = this.users.findIndex( user => user.id_user == value);
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
      console.log('messages=', Res);

      //все что послано кем-то нам делаем прочитанным => sMarkedIcon 
      Res.forEach ( (el: IDocChat) => {
        if (el.bMarked) el.marked_icon = this.sMarkedIcon; else el.marked_icon = this.sUnMarkedIcon; 
        if (el.id_user !== this.currentUser.id_user && el.bMarked === false) {
          el.bMarked = true;
          el.marked_icon = this.sMarkedIcon; 
          //console.log(el);
          //отправляем сведения о прочитанном сообщении
          this.socketService.sengReadMessage(el.id_user, el.id_user_to, el.createdAt);
        }

      });


      //if (this.appearMessages.length !== Res.length) {
           this.appearMessages = [...Res];
      //}


      this.countUnreadMessage();
      //console.log('this.appearMessages=', this.appearMessages);

      this._scrollToBottom();
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

      console.log('====>', this.users.find( user=> user.id_user == el.id_user));  

    });

    this.users = [...this.users];
    console.log('this.users', this.users);

     
   }
   

  
}
