import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, ServiceParameter } from 'src/app/@main/services/app.service';
import { HandlerService } from 'src/app/@main/services/handler.service';
import { AuthorizerService } from 'src/app/security/authorizer.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit, AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private handler: HandlerService,
    private authorizer: AuthorizerService,
    private router: Router) {
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit')

    if (this.authorizer.authFlow == 'authcode') {

      this.activatedRoute.queryParams.subscribe(params => {
        let authCode = params['code'];
        console.log(params)
        this.authorizer.loginAuthCodeFlow(authCode)
          .then(result => {
            this.router.navigate(['/home'])
          }).catch(err => {
            console.error(err)
            alert(JSON.stringify(err))
            this.router.navigate(['/login'])
          })
      });

    } else if (this.authorizer.authFlow == 'implicit') {

        this.activatedRoute.fragment.subscribe(fragments => {
        //Validate if nonce received here is the same that was send in request auth code
        //validate state to avoid CSRF atack
        console.log(fragments)
        const params = new URLSearchParams(fragments?.toString())
        const access_token = params.get('access_token')
        const id_token = params.get('id_token')
        const refresh_token = params.get('refresh_token')

        this.authorizer.store(access_token, 'token');
        this.authorizer.store(id_token, 'idtoken');
        this.authorizer.store(refresh_token, 'refreshtoken');

        //atualizar o token na storage
        this.router.navigate(['/home'])
      });

    }
  }

  ngOnInit(): void {
    console.log('ngOnInit')
  }
}
