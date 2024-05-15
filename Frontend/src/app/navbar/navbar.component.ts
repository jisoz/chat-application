import { Component } from '@angular/core';
import { AlertifyServiceService } from '../../services/alertify-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loggedinUser!: string;

  constructor(private alertify: AlertifyServiceService) {
   
  
  }

  loggedin() {
    const user=localStorage.getItem('user');
     if(user){
      this.loggedinUser = user;
      return this.loggedinUser;
     }
     return 0;
   
  }
  onLogout() {
    localStorage.removeItem('user');
    this.alertify.success('You are logged out !');
  }
}
