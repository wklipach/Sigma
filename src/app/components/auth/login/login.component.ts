import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import * as CryptoJS from 'crypto-js';
import {Subscription, timer} from 'rxjs';
import { ISessionUser } from 'src/app/interface/auth/user';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public showErr = false;
  public showSucc = false;
  sResTrouble = '';
  nStopMs = 1000;
  subscribeTimer:  Subscription  = Subscription.EMPTY;
  stopCondition = false;
  editor = 0;
  loginForm: FormGroup;

  constructor(private router: Router, private auth: AuthService) {

    this.loginForm  = new FormGroup({
      'nameOrEmail': new FormControl('',
        [Validators.required, Validators.minLength(1)]),
      'password': new FormControl('',
        [Validators.required])
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    if (typeof this.subscribeTimer !== 'undefined') {
      this.subscribeTimer.unsubscribe();
    }
  }


  block_button(ms: number) {
    // блокируем кнопку 1 секунду
    this.stopCondition = true;
    this.subscribeTimer = timer(ms).subscribe(() =>
      this.stopCondition = false);
  }

  submit() {
    const sUserOrEmail = this.loginForm.controls['nameOrEmail'].value;

    if (this.loginForm.controls['nameOrEmail'].value.toString().length < 1)  {
      this.sResTrouble = 'Введите имя входа.';
      return;
    }

    const sPassword = this.loginForm.controls['password'].value;
    const tUser =  {sUserOrEmail: this.loginForm.controls['nameOrEmail'].value, sPassword: this.loginForm.controls['password'].value};

    this.auth.getUserFromBase(sUserOrEmail).subscribe(
      (value: any) => {

        if (value.length > 1) {
          this.showErr = true;
          this.showSucc = false;
          this.sResTrouble = 'С такими данными больше одного пользователя.';
          this.auth.clearStorage();
          this.block_button(this.nStopMs);
        }

        if (value.length === 0) {
          this.showErr = true;
          this.showSucc = false;
          this.sResTrouble = 'Пользователь не найден.';
          this.auth.clearStorage();
          this.block_button(this.nStopMs);
          return;
        }

        if (value.length === 1) {
          this.editor = value[0].editor;
          const dbPassword = value[0].password;
          const sFormPassword = CryptoJS.SHA256(this.loginForm.controls['password'].value.trim().toLowerCase()).toString().toLowerCase();

          console.log('sFormPassword=', sFormPassword);

          if (dbPassword !== sFormPassword) {
            this.showErr = true;
            this.showSucc = false;
            this.sResTrouble = 'Вы неверно ввели пароль.';
            this.auth.clearStorage();
            this.block_button(this.nStopMs);
            return;
          }
          
          console.log('успешный вход');

          const sUser: ISessionUser = {id_user: value[0]?.id, name: value[0]?.login, email: value[0]?.email, fio: value[0]?.fio, organization: value[0]?.organization};
          this.auth.setSessionUser(sUser);
          this.auth.setStorage(value[0].login, true, value[0].id);
          this.router.navigate(['/']);
        } // value[0].length === 1
      });
  }

}
