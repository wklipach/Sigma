import { Component, OnInit } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import * as CryptoJS from 'crypto-js';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  bPassword = false;
  registerForm: FormGroup;
  

  // new FormControl(null, { validators: [Validators.required, Validators.minLength(2)], updateOn: 'blur' }, 
  //                                    [this.comapnyService.validate.bind(this.companyService)]),

  constructor(private router: Router, private auth: AuthService) {

    this.registerForm  = new FormGroup({
      
      userLogin: new FormControl('', 
                                        [Validators.required, Validators.minLength(1)], 
                                        [(this.userNameAsyncValidator as AsyncValidatorFn).bind(this)]
                                      ),

      userFio: new FormControl(''),
      organization: new FormControl(''),

      userEmail: new FormControl('', 
                                       [Validators.required, Validators.email], 
                                       [(this.userEmailAsyncValidator as AsyncValidatorFn).bind(this)]
                                       ),
      userPassword1: new FormControl('',  [Validators.required]),
      userPassword2: new FormControl('', 
                                        [Validators.required, Validators.minLength(1)], 
                                        [(this.password2AsyncValidator as AsyncValidatorFn).bind(this)]
                                        )
    });

  }

  ngOnInit(): void {
  }

  // валидатор по имени пользователя
  userNameAsyncValidator(control: FormControl): Promise<{[s: string]: boolean}> {
    return new Promise(
      (resolve, reject) => {

        return this.auth.getNickUserTable(control.value).subscribe(
          (data) => {
            if (Number(data) > 0) {
              resolve( {'myError': true});
            }   else {
              resolve({});
            }
          }
        );
      }
    );
  }

  // валидатор по паролю
  password2AsyncValidator(control: FormControl): Promise<{[s: string]: boolean}> {
    return new Promise(
      (resolve, reject) => {
        if (this.registerForm.controls['userPassword1'].value !== control.value) {
          resolve( {'myError': true});
        } else {
          resolve({});
        }
      }
    );
  }

  // валидатор по EMail
  userEmailAsyncValidator(control: FormControl): Promise<{[s: string]: boolean}> {
    return new Promise(
      (resolve, reject) => {

        return this.auth.getEmailUserTable(control.value).subscribe(
          (data) => {
            if (Number(data) > 0) {
              resolve( {'errorEmailExists': true});
            } else {
              resolve({});
            }
          }
        );
      }
    );
  }

  submit() {
    this.bPassword = false;


    console.log('this.registerForm.value=', this.registerForm.value);
    const {userLogin, userFio, organization, userEmail, userPassword1, userPassword2} = this.registerForm.value;

    if (userPassword1.trim() !== userPassword2.trim()) {
      this.bPassword = true;
      return -1;
    }

    const NewUser = {
    id: 0,  
    name: userLogin,
    password: CryptoJS.SHA256(userPassword1.trim().toLowerCase()).toString().toLowerCase(),
    email: userEmail,
    fio: userFio,
    bitdelete: false,
    organization: organization.toString().trim()
  };

    const curSubject = 'Добро пожаловать.';
    const curLetter = 'Спасибо за регистрацию. Надеемся, что вы найдете здесь решение ваших вопросов.';


    return this.auth.setNewUser(NewUser, curSubject, curLetter).subscribe((value: any) => {

//  console.log(value);
//  console.log(NewUser);
//  console.log('insertedId=', value['insertedId']);

      this.auth.setStorage(NewUser['name'], true, value.insertId);
      this.router.navigate(['/login']);
    });
  }

}
