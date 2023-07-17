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

const routes: Routes = [
  { path: '', component: MainComponent, canActivate: [mainGuard] },
  { path: 'number', component: NumberComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'listobjects', component: ListObjectsComponent },
  { path: 'listmtr', component: ListMtrComponent },
  { path: 'liststaff', component: StaffComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
