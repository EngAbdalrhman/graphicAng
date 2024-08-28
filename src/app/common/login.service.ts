import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  isLogin: boolean = false;
  userName: string | null = '';
  constructor() {
    if (localStorage.getItem('isLogin') == 'true') {
      this.isLogin = true;
      this.userName = localStorage.getItem('userName');
    }
  }
  logMe(userName: string, password: string, remember: boolean) {
    if (userName == 'admin' && password == 'admin') {
      this.isLogin = true;
      this.userName = userName;
      if (remember) {
        localStorage.setItem('isLogin', 'true');
        localStorage.setItem('userName', userName);
      }
    }
  }
  logOut() {
    this.isLogin = false;
    localStorage.setItem('isLogin', 'false');
    localStorage.removeItem('userName');
  }
}
