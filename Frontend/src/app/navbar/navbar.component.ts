import { Component, OnInit } from '@angular/core';
import { AlertifyServiceService } from '../../services/alertify-service.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  loggedinUser: any;

  constructor(private alertify: AlertifyServiceService, public authservice: AuthService, private router: Router) {
  

  }
  ngOnInit(): void {
    this.authservice.currentuser$.subscribe(user => {
     
      this.loggedinUser = user;
     
    })
  
  }

  loggedin() {
    
   return this.authservice.getCurrentLoginState();
  }
  onLogout() {

    
   this.authservice.logout();
    // console.log( this.authservice.getCurrentLoginState());
    this.alertify.success('You are logged out !');
    this.router.navigate(['/login']);
  }
}
