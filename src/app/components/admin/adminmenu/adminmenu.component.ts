import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';


interface IAccessUser {
  id: number;
  login: string;
  fio: string;
}

interface IAccessMenu {
  id_menu: number;
  RefName: string;
  RusName: string;
  boolAccess: boolean;
  }


@Component({
  selector: 'app-adminmenu',
  templateUrl: './adminmenu.component.html',
  styleUrls: ['./adminmenu.component.css']
})

export class AdminmenuComponent {

  users: IAccessUser[] = [];
  accessUserMenu: IAccessMenu[] = [];
  selectedUser: number = 0;

  constructor (private authService: AuthService) {

  }


  ngOnInit(): void {
    this.authService.getAllUsers().subscribe( (res: IAccessUser[])  => {
      this.users = res;

      //имитируем клик на первой строке
      if (this.users.length > 0) {
           this.clickAccess(this.users[0].id);
      }

    });
  }

  clickAccess(id_user: number) {
    this.authService.getAccessMenu(id_user).subscribe ( (res: any) => {
      this.accessUserMenu = res;
      this.selectedUser = id_user;

    });
   }

   fieldsChange (target: any, id_menu: number, RefName: string) {
    console.log(target.checked);


    if (this.selectedUser<=0) return;

    let bollAccess: boolean = false;
    if (target.checked) {
      bollAccess = target.checked;
    }

    this.authService.setAccessMenuOne(bollAccess, id_menu, RefName, this.selectedUser).subscribe( (res: any)  => {
      console.log(res);
    });



   }


}
