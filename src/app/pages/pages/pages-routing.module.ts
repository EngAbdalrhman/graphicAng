import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { ErrorComponent } from '../error/error.component';
import { AboutComponent } from './about/about.component';
import { authenticationGuard } from '../../common/authentication.guard';

const routes: Routes = [
  {
    path: 'home',
    component: PagesComponent,
    canActivate: [authenticationGuard],
  },
  // weired
  {
    path: 'login',
    loadComponent: () =>
      import('../login/login.component').then((m) => m.LoginComponent),
  },
  { path: 'about', component: AboutComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
