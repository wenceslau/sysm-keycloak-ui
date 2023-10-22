import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService, ServiceParameter } from 'src/app/@main/services/app.service';
import { AuthorizerService } from 'src/app/security/authorizer.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit, AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthorizerService,
    private router: Router) {
  }
  ngAfterViewInit(): void {
    console.log('ngAfterViewInit')
    //AuthCodeFlow
    this.activatedRoute.queryParams.subscribe(params => {
      let authCode = params['code'];
      console.log(params)
      this.auth.keycloakTokenAuthCodeFlow(authCode)
      .then(result => {
        this.router.navigate(['/home'])
      }).catch(err => {
        alert(JSON.stringify(err))
      })
    });

    //implicit flow
    this.activatedRoute.fragment.subscribe(fragments => {
      // //Validate if nonce received here is the same that was send in request auth code
      // //validate state to avoid CSRF atack
      // console.log(fragments)
      // const access_token = new URLSearchParams(fragments?.toString()).get('access_token')
      // console.log({access_token})
      // //atualizar o token na storage
      // this.router.navigate(['/home'])
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit')
  }
}
