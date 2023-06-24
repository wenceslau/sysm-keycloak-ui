import { Component } from '@angular/core';
import { freeSet } from '@coreui/icons';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  icons = freeSet ;

}
