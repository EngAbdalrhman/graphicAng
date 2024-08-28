import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { LoginService } from '../../common/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    RippleModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  items: MenuItem[] | undefined;

  constructor(public loginService: LoginService, private _route: Router) {}
  ngOnInit() {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: 'home',
        // shortcut: '⌘+H',
      },
      {
        label: 'Designer',
        icon: 'pi pi-star',
        routerLink: 'home/chart',
        // shortcut: '⌘+D',
      },
      {
        label: 'About',
        icon: 'pi pi-star',
        routerLink: 'about',
        // shortcut: '⌘+S',
      },
    ];
  }
  logout($event: MouseEvent) {
    $event?.preventDefault();
    this.loginService.logOut();
    this._route.navigate(['/login']);
  }
}
