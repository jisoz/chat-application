import { Component } from '@angular/core';
import { AlertifyServiceService } from '../../services/alertify-service.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loggedinUser!: string;

  constructor(private alertify: AlertifyServiceService, private authservice: AuthService, private router: Router) {
   
  
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
    this.authservice.updateLoggedInState(false);

    this.alertify.success('You are logged out !');
    this.router.navigate(['/login']);
  }
}
