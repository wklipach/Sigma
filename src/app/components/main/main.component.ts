import { Component } from '@angular/core';
import { AuthService }  from "../../services/auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent {


  constructor(private authService: AuthService, private router: Router) {

  }


  public Exit() {

    this.authService.clearStorage();
    this.router.navigate(['/login']);

    
  }


}
