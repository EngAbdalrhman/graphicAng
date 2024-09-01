import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages/pages.component';
import { ErrorComponent } from '../error/error.component';
import { AboutComponent } from './about/about.component';
import { authenticationGuard } from '../../common/authentication.guard';
import { FlowchartComponent } from './flowchart/flowchart.component';

const routes: Routes = [
  {
    path: 'home',
    component: PagesComponent,
    canActivate: [authenticationGuard],
    children: [
      {
        path: 'chart',
        loadChildren: () =>
          import('./flowchart/flowchart.module').then((m) => m.FlowchartModule),
      },
    ],
  },
  // weired
  // {
  //   path: 'login',
  //   loadComponent: () =>
  //     import('../login/login.component').then((m) => m.LoginComponent),
  // },
  { path: 'about', component: AboutComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
