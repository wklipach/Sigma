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
import { OverviewComponent } from './components/account/overview/overview.component';

// services
import {AuthService} from './services/auth.service';
import { MainComponent } from './components/main/main.component';
import { ChatComponent } from './components/chat/chat.component';
import { ChatService } from './services/chat.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GeneralComponent } from './components/account/general/general.component';
import { SummaryComponent } from './components/account/summary/summary.component';
import { SummaryService } from './services/summary.service';
import { ListObjectsComponent } from './components/protected_objects/list-objects/list-objects.component';
import { AvatarService } from './services/avatar.service';
import { SettingsComponent } from './components/account/settings/settings.component';
import { ListMtrComponent } from './components/mtr/list-mtr/list-mtr.component';


// socket config
const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CaptionComponent,
    BasementComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    MainComponent,
    OverviewComponent,
    ChatComponent,
    GeneralComponent,
    SummaryComponent,
    ListObjectsComponent,
    SettingsComponent,
    ListMtrComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ScrollingModule,
    SocketIoModule.forRoot(config)    
  ],
  providers: [GlobalRef, DatePipe, AuthService, ChatService, SummaryService, AvatarService],
  bootstrap: [AppComponent]
})
export class AppModule { }
