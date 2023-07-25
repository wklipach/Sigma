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
  { path: 'listobjects', component: ListObjectsComponent, canActivate: [mainGuard] },
  { path: 'listmtr', component: ListMtrComponent, canActivate: [mainGuard] },
  { path: 'mtr2', component: Mtr2Component, canActivate: [mainGuard] },
  { path: 'liststaff', component: StaffComponent, canActivate: [mainGuard] },
  { path: 'test', component: TestComponent }
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
