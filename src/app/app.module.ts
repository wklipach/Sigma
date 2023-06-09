import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// providers
import {DatePipe} from '@angular/common';
import {GlobalRef} from '../../globalref';

// components
import { LoginComponent } from './components/auth/login/login.component';
import { CaptionComponent } from './components/caption/caption.component';
import { BasementComponent } from './components/basement/basement.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/auth/register/register.component';


// services
import {AuthService} from './services/auth.service';
import { MainComponent } from './components/main/main.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CaptionComponent,
    BasementComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule    
  ],
  providers: [GlobalRef, DatePipe, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
