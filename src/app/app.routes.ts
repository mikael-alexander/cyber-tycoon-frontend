import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: '**', redirectTo: '' }
];
