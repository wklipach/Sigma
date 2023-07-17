import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-number',
  templateUrl: './number.component.html',
  styleUrls: ['./number.component.css']
})
export class NumberComponent {




  constructor(private authService: AuthService, private router: Router) {
  }


  onNumberClick() {
    
    let sInput = (document.getElementById('secretNumber') as HTMLInputElement).value.trim().toUpperCase();
    if (sInput === '358451') {
      this.authService.setNumber();
      this.router.navigate(['/']);

    }


     

    

}

}
