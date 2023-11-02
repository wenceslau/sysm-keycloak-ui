import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizerService } from '../authorizer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { lastValueFrom } from 'rxjs';
import { HandlerService } from 'src/app/@main/services/handler.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(
    private router: Router,
    private authorizer: AuthorizerService,
    private handler: HandlerService,
    private formBuild: FormBuilder) {

    this.formLogin = this.formBuild.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {

    if (this.authorizer.authFlow != 'resource') {
      this.router.navigate(['/keycloak/login'])
    }

  }

  formLogin: FormGroup
  error: string = ""

  login() {
    this.handler.loading()
    this.error = ""
    let user = this.formLogin.value.username
    let pass = this.formLogin.value.password

    this.authorizer.loginResourceFlow(user, pass)
      .then(result => {
        this.router.navigate(['/home'])

      }).catch(err => {
        let errMsg = this.handler.throwError(err)
        this.error = errMsg

      }).finally(() => {
        this.handler.loading()
      })
  }

}
