import { Component } from '@angular/core';
import { PagesModule } from '../pages/pages.module';
import { Button } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { Ripple, RippleModule } from 'primeng/ripple';
import { NavigationStart, Router, RouterOutlet } from '@angular/router';
import { LoginService } from '../../common/login.service';
// import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Add this line
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PagesModule,
    Button,
    CheckboxModule,
    InputTextModule,
    RippleModule,
    Ripple,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  checked: boolean = false;
  constructor(private _login: LoginService) {}
  // binary: boolean = false;
  handleLogin() {
    this._login.logMe(this.username, this.password, this.checked);
    // console.log(this.username);
    // console.log(this.password);
    console.log(this.checked);
  }
}
