import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LoginComponent } from './pages/login/login.component';
// import { PagesComponent } from './pages/pages/pages/pages.component';
// import { PagesModule } from './pages/pages/pages.module';
import { authenticationGuard } from './common/authentication.guard';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  // { path: 'login', component: LoginComponent },
  {
    path: 'pages',
    canActivate: [authenticationGuard],
    loadChildren: () =>
      import('./pages/pages/pages.module').then((m) => m.PagesModule),
  },
  // { path: '**', redirectTo: 'pages' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
