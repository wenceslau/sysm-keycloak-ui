import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthorizerService } from './authorizer.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// export const authorizerGuard: CanActivateFn = (route, state) => {
//   console.log(route.url);
//   console.log(state.url)
//   console.log(route.data);
//   return true;
// };

@Injectable({
  providedIn: 'root'
})
export class AuthorizerGuard implements CanActivate {

  constructor(public auth: AuthorizerService) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('next: ' + next);
    console.log(next.url);
    console.log(state.url)
    console.log(next.data);
    return true;
  }
}


