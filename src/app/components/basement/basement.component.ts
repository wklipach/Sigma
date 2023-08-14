import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-basement',
  templateUrl: './basement.component.html',
  styleUrls: ['./basement.component.css']
})
export class BasementComponent implements OnInit {


  unAceptTaskCount?: number = 0;

  constructor(private authService: AuthService, 
              private chatService: ChatService ,  
              private router: Router,
              private taskService:  TaskService) 
              { }

  ngOnInit(): void {
    this.countTask();
  }


  public Exit() {
    this.chatService.onDisconnect();
    this.authService.clearStorage();
    this.router.navigate(['/login']);
  }


  public unreadTask() {
    this.router.navigate(['/listtask']);
  }


  public countTask() {
    this.taskService.unAceptTaskCount().subscribe ( (res: any)=> {
      console.log('res=', res);
         this.unAceptTaskCount = res[0].tCount;
    });
  }


  

}
