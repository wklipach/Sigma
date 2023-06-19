import { Component, OnInit } from '@angular/core';
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




  public resp_msg: IDocChat = {id_user: -1, id_user_to: -1, message: '', bMarked: false};
  public chatUsers = {};
  
  chatForm: FormGroup;
  currentUser: ISessionUser = {
    id_user: -1,
    name: '',
    email: '',
    fio: '',
    organization: ''
  };
  
  users: IUserChat[] = [];


  constructor(private socketService: ChatService, private auth: AuthService) { 

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


    this.socketService.onMessage().subscribe((data: any) => 
           this.resp_msg = data
      );

    this.socketService.onUsers().subscribe((data: any) =>  {
          this.chatUsers = data;

          // включаем и сортируем активных юзеров
          this.activeUser();
       }
    );


  }


  onMessage(): void {

    const send_msg: IDocChat = {id_user: -1, id_user_to: -1, message: '', bMarked: false};

    send_msg.message =  this.chatForm.controls['send_message'].value;

    this.socketService.sengMessage(send_msg);
  }


  onTest(): void {
    
    // выключаем всех юзеров
    this.users.map((user) => {
         user.connected = false;
     });

    //включаем найденных как активных 
    for (const [key, value] of Object.entries(this.chatUsers)) {
      let userIndex = this.users.findIndex( user => user.id_user == value);
      console.log('userIndex1=', userIndex)
      if (userIndex > -1) {
         this.users[userIndex].connected = true;
      }
    }
    

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
          console.log(this.users);
    }




    

}



/*
browsers.sort(function (x, y) {
  // сначала сортируем по полю 'name'
  if (x.name < y.name) {
      return -1;
  }

  if (x.name > y.name) {
      return 1;
  }

  // если имена совпадают, то сортируем по 'year'
  return x.year - y.year;
});
*/