import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { GeneralComponent } from './components/account/general/general.component';
import { OverviewComponent } from './components/account/overview/overview.component';
import { SummaryComponent } from './components/account/summary/summary.component';
import { SettingsComponent } from './components/account/settings/settings.component';
import { MainComponent } from './components/main/main.component';
import { mainGuard } from './guards/login/main.guard';
import { ListObjectsComponent } from './components/protected_objects/list-objects/list-objects.component';
import { ListMtrComponent } from './components/mtr/list-mtr/list-mtr.component';
import { StaffComponent } from './components/staff/staff.component';
import { NumberComponent } from './components/auth/number/number.component';
import { numberGuard } from './guards/login/number.guard';
import { TestComponent } from './components/test/test.component';
import { Mtr2Component } from './components/mtr2/mtr2.component';
import { Obj2Component } from './components/protected_objects/obj2/obj2.component';
import { Staff2Component } from './components/staff2/staff2/staff2.component';
import { AddFilterComponent } from './add-filter/add-filter.component';
import { BasementComponent } from './components/basement/basement.component';
import { AddTaskComponent } from './components/task/add-task/add-task.component';
import { ListTaskComponent } from './components/task/list-task/list-task.component';
import { TaskComponent } from './components/task/task/task.component';
import { ObjectCardComponent } from './components/protected_objects/object-card/object-card.component';
import { Obj2settingsComponent } from './components/protected_objects/obj2settings/obj2settings.component';
import { OllrComponent } from './components/account/general/ollr/ollr.component';
import { ReadtaskComponent } from './components/task/readtask/readtask.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  { path: '', component: MainComponent, canActivate: [mainGuard] },
  { path: 'number', component: NumberComponent},
  { path: 'login', component: LoginComponent, canActivate: [numberGuard]},
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [numberGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [numberGuard]},
  { path: 'general', component: GeneralComponent, canActivate: [mainGuard] },
  { path: 'overview', component: OverviewComponent, canActivate: [mainGuard] },
  { path: 'summary', component: SummaryComponent, canActivate: [mainGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [mainGuard] },
  { path: 'ollr', component: OllrComponent, canActivate: [mainGuard] },
  { path: 'listobjects', component: ListObjectsComponent, canActivate: [mainGuard] },
  { path: 'obj2', component: Obj2Component, canActivate: [mainGuard] },
  { path: 'listmtr', component: ListMtrComponent, canActivate: [mainGuard] },
  { path: 'mtr2', component: Mtr2Component, canActivate: [mainGuard] },
  { path: 'liststaff', component: StaffComponent, canActivate: [mainGuard] },
  { path: 'staff2', component: Staff2Component, canActivate: [mainGuard] },
  { path: 'test', component: TestComponent },
  { path: 'filter', component: AddFilterComponent, canActivate: [mainGuard] },
  { path: 'basement', component: BasementComponent, canActivate: [mainGuard] },
  { path: 'addtask', component: AddTaskComponent, canActivate: [mainGuard] },
  { path: 'listtask', component: ListTaskComponent, canActivate: [mainGuard] },
  { path: 'task', component: TaskComponent, canActivate: [mainGuard] },
  { path: 'obj2card', component: ObjectCardComponent, canActivate: [mainGuard] },
  { path: 'obj2settings', component: Obj2settingsComponent, canActivate: [mainGuard] },
  { path: 'readtask', component: ReadtaskComponent, canActivate: [mainGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [mainGuard] },
    
  ];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
