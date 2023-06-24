import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HandlerService } from '../../services/handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {


  constructor(private router: Router, private handler: HandlerService) {
  }


  reRouter(path: string): void{

    this.router.navigate(['/'+path])

  }

  userNameLooged(): string {
    return this.handler.userNameLogged();
  }

}
