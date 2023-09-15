import { Component, ElementRef, OnInit } from '@angular/core';
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
    this.authService.clearStorage();
    this.router.navigate(['/login']);
  }

  public Summary() {
    const id_staff = (<HTMLInputElement>document.getElementById('mySummary')).value;
    this.router.navigate(['summary'], { queryParams: { id_staff }});
  }


  public ListoOjects() {
    this.router.navigate(['listobjects']);
  }

  public ListStaff() {
    this.router.navigate(['liststaff']);
  }
  

  ListMtr() {
    this.router.navigate(['listmtr']);
  }


  procFilter() {
    this.router.navigate(['filter']);
  }


}
