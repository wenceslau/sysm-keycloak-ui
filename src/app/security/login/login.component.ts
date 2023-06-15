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
    private auth: AuthorizerService,
    private handler: HandlerService,
    private formBuild: FormBuilder) {

    this.formLogin = this.formBuild.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
  }

  formLogin: FormGroup;
  error: string = "";

  login() {

    this.error = "";
    let user = this.formLogin.value.username;
    let pass = this.formLogin.value.password;

    this.auth.login(user, pass)
      .then(result => {
        this.router.navigate(['/home'])
      }).catch(err => {
        this.handler.addSnackBarError(err)
        this.error = err;
      }).finally(() => {
        console.log("")
      })
  }

}
