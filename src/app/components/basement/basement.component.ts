import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-basement',
  templateUrl: './basement.component.html',
  styleUrls: ['./basement.component.css']
})
export class BasementComponent implements OnInit {

  constructor(private authService: AuthService, 
              private chatService: ChatService ,  
              private router: Router) 
              { }

  ngOnInit(): void {
  }


  public Exit() {
    this.chatService.onDisconnect();
    this.authService.clearStorage();
    this.router.navigate(['/login']);
  }


  public unreadTask() {
    this.router.navigate(['/listtask']);
  }

}
