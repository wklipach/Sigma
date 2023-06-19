import { Component, OnInit } from '@angular/core';
import { AuthService }  from "../../services/auth.service";
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent implements OnInit  {


  constructor(private authService: AuthService, private chatService: ChatService ,  private router: Router) {

  }


  ngOnInit(): void {

  }





  public Exit() {
    this.chatService.onDisconnect();
    this.authService.clearStorage();
    this.router.navigate(['/login']);
  }


}
