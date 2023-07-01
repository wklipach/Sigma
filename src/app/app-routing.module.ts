import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { GeneralComponent } from './components/account/general/general.component';
import { OverviewComponent } from './components/account/overview/overview.component';
import { SummaryComponent } from './components/account/summary/summary.component';
import { MainComponent } from './components/main/main.component';
import { mainGuard } from './guards/login/main.guard';

const routes: Routes = [
  { path: '', component: MainComponent, canActivate: [mainGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'general', component: GeneralComponent },
  { path: 'overview', component: OverviewComponent },
  { path: 'summary', component: SummaryComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
