import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
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

  constructor(public auth: AuthorizerService,
    private router: Router
    ) {
  }
  canActivate(
    router: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    console.log('next: ' + router);
    console.log('state: ' + state);

    if (this.auth.isAccessTokenInvalid()){
     // alert('invalid token')
      this.router.navigate(['/login'])
    }

    if (router.data) {
      let obj = JSON.parse(JSON.stringify(router.data));

      if (obj && obj.roles) {
        for (let i = 0; i < obj.roles.length; i++) {
          if (this.auth.hasPermission(obj.roles[i]) == false){
            //alert('denied')
            this.router.navigate(['/access-denied'])
            return false;
          }
        }
      }
    }
    //alert('true')
    return true;
  }
}


