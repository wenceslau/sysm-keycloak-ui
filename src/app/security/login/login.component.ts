import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizerService } from '../authorizer.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { lastValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  constructor(
    private router: Router,
    private auth: AuthorizerService,
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

    let obs = this.auth.login(user, pass);
    let value = lastValueFrom(obs);

    value.then(data => {
      console.log(data);
      this.router.navigate(['/home'])
    }).catch(err => {
      console.error(err);
      this.error = err;
    })

  }

}
