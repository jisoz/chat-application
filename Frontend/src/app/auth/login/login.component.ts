import { Component } from '@angular/core';
import { AlertifyServiceService } from '../../../services/alertify-service.service';
import { AuthService } from '../../../services/auth.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

constructor(private authservice:AuthService , private alertify:AlertifyServiceService, private route:Router){}

loading = false;
onLogin(loginform :NgForm){

this.loading = true;
  this.authservice.signin(loginform.value).subscribe(
 
   res=>{
    this.authservice.updateLoggedInState(true);
     const user=res.name
    if(user){
     localStorage.setItem('user',user)
    }
  this.alertify.success("login success")
   this.route.navigate(["/"])
   this.loading = false;
   },
   err=>{
     this.alertify.error(err?.error)
     this.loading = false;
   }
  )

 }

}
