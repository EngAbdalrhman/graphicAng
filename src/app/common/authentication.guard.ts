// import { CanActivateFn } from '@angular/router';

// export const authenticationGuard: CanActivateFn = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivate,
} from '@angular/router';
import { LoginService } from './login.service'; // Import your login service

@Injectable()
export class authenticationGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | any {
    if (!this.loginService.isLogin) {
      console.log('not logged in');
      this.router.navigate(['/login']); // Redirect to login page if not logged in
      return false;
    }
    return true;
  }
}
