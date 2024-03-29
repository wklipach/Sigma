import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// providers
import {CommonModule, DatePipe} from '@angular/common';
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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GeneralComponent } from './components/account/general/general.component';
import { SummaryComponent } from './components/account/summary/summary.component';
import { SummaryService } from './services/summary.service';
import { ListObjectsComponent } from './components/protected_objects/list-objects/list-objects.component';
import { AvatarService } from './services/avatar.service';
import { SettingsComponent } from './components/account/settings/settings.component';
import { ListMtrComponent } from './components/mtr/list-mtr/list-mtr.component';
import { StaffComponent } from './components/staff/staff.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ObjectCardComponent } from './components/protected_objects/object-card/object-card.component';
import { ObjectSummaryComponent } from './object-summary/object-summary.component';
import { NumberComponent } from './components/auth/number/number.component';
import { TestComponent } from './components/test/test.component';
import { ResizableModule } from './directives/resizable.module';
import { EventsComponent } from './events/events.component';
import { Mtr2Component } from './components/mtr2/mtr2.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Obj2Component } from './components/protected_objects/obj2/obj2.component';
import { Staff2Component } from './components/staff2/staff2/staff2.component';
import { AddFilterComponent } from './add-filter/add-filter.component';
import { AddTaskComponent } from './components/task/add-task/add-task.component';
import { ListTaskComponent } from './components/task/list-task/list-task.component';
import { TaskComponent } from './components/task/task/task.component';
import { Obj2settingsComponent } from './components/protected_objects/obj2settings/obj2settings.component';
import { OllrComponent } from './components/account/general/ollr/ollr.component';
import { ReadtaskComponent } from './components/task/readtask/readtask.component';
import { TabelComponent } from './components/tabel/tabel.component';
import { AdminmenuComponent } from './components/admin/adminmenu/adminmenu.component';
import { CheckObjectComponent } from './components/protected_objects/check-object/check-object.component';
import { PostObjectComponent } from './components/protected_objects/post/post-object/post-object.component';
import { ChecklistService } from './services/checklist.service';
import { ListCheckComponent } from './components/protected_objects/list-check/list-check.component';
import { ListCheckCardComponent } from './components/protected_objects/list-check/list-check-card/list-check-card.component';
import { ListPostComponent } from './components/protected_objects/post/list-post/list-post.component';
import { PostReadComponent } from './components/protected_objects/post/post-read/post-read.component';
import { ShareService } from './services/share.service';
import { DragDropTestComponent } from './components/drag-drop-test/drag-drop-test.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DragDropStaffComponent } from './components/protected_objects/drag-drop-staff/drag-drop-staff.component';
import { DragDropStaffService } from './services/drag-drop-staff.service';
import { DragDropStaff2Component } from './components/protected_objects/drag-drop-staff2/drag-drop-staff2.component';
import { D3OrgChartComponent } from './d3-org-chart/d3-org-chart.component';
import {OrgChartModule} from './modules/org-chart/org-chart.module';
import { DragGropStaff3Component } from './components/protected_objects/drag-grop-staff3/drag-grop-staff3.component';


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
    ListMtrComponent,
    StaffComponent,
    ObjectCardComponent,
    ObjectSummaryComponent,
    NumberComponent,
    TestComponent,
    EventsComponent,
    Mtr2Component,
    Obj2Component,
    Staff2Component,
    AddFilterComponent,
    AddTaskComponent,
    ListTaskComponent,
    TaskComponent,
    Obj2settingsComponent,
    OllrComponent,
    ReadtaskComponent,
    TabelComponent,
    AdminmenuComponent,
    CheckObjectComponent,
    PostObjectComponent,
    ListCheckComponent,
    ListCheckCardComponent,
    ListPostComponent,
    PostReadComponent,
    DragDropTestComponent,
    DragDropStaffComponent,
    DragDropStaff2Component,
    D3OrgChartComponent,
    DragGropStaff3Component
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ScrollingModule,
    FontAwesomeModule,
    ResizableModule,
    NgxDatatableModule,
    DragDropModule,
    OrgChartModule
  ],
  providers: [GlobalRef, 
              DatePipe, 
              AuthService, 
              SummaryService, 
              AvatarService, 
              ChecklistService, 
              ShareService, 
              ChatService, 
              DragDropStaffService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
