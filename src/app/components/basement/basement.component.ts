import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalRef } from 'globalref';
import { Subscription, timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { TaskService } from 'src/app/services/task.service';




interface IAccessMenu {
id_menu: number;
RefName: string;
RusName: string;
boolAccess: boolean;
}

@Component({
  selector: 'app-basement',
  templateUrl: './basement.component.html',
  styleUrls: ['./basement.component.css']
})
export class BasementComponent implements OnInit {


  unreadChatMessages: number = 0;
  unAceptTaskCount?: number = 0;
  accessUserMenu: IAccessMenu[] = [];
  sAvatar : string = "/assets/img/usernull.jpg";
  private _UserChatCount!: Subscription;


  constructor(private authService: AuthService, 
              private chatService: ChatService ,  
              private router: Router,
              private gr: GlobalRef,
              private taskService:  TaskService) 
              {  }

  ngOnInit(): void {

    this.countTask();


    this.authService.getAccessMenu(this.authService.getSessionUser().id_user).subscribe ( (res: any) => {
      this.accessUserMenu = res;
    });

    //получение аватара из базы
    this.authService.getUserAvatar(this.authService.getSessionUser().id_user).subscribe ( (res: any) => {
        if (res.length>0) {
          if (res[0].ItIsAvatar>0) {
            this.sAvatar = this.gr.sUrlAvatarGlobal+res[0].avatar_name;
          }
       };
    });


    this.chatService.isCountUnreadMessagesIn().subscribe ( (res: number) => {
      this.unreadChatMessages = res;
    });


    //СООБЩЕНИЯ ДЛЯ ЧАТА

    // НАЧАЛО бесконечный таймер 
    let timer$ = timer(2000, 30000);
    timer$.subscribe(t => this.countChatMessages());
    // КОНЕЦ бесконечный таймер 
  }


  countChatMessages() {
    this.authService.getCountMessages(this.authService.getSessionUser().id_user).subscribe ( (res: any) => {
      // console.log('кол непр сообщ', res[0].CountMessages);
      if (res.length>0)  this.chatService.isWriteCountUnreadMessages(res[0].CountMessages);
    });
  }


  getAccessMenu(sName: string): boolean {
    return  this.accessUserMenu.find( el => el.RefName == sName )?.boolAccess || false;
  }


  public Exit() {
    this.authService.clearStorage();
    this.router.navigate(['/login']);
  }


  public unreadTask() {
    this.router.navigate(['/listtask']);
  }

  public chat() {
        this.router.navigate(['/chat']);
  }


  public countTask() {
    this.taskService.unAceptTaskCount().subscribe ( (res: any)=> {
      // console.log('res=', res);
         this.unAceptTaskCount = res[0].tCount;
    });
  }
  

}
