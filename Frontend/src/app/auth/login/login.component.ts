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
export class LoginComponent  {

constructor(private authservice:AuthService , private alertify:AlertifyServiceService, private route:Router){}


onLogin(loginform :NgForm){

  this.authservice.signin(loginform.value).subscribe(
 
   res=>{

    // console.log( this.authservice.getCurrentLoginState());


  this.alertify.success("login success")
   this.route.navigate(["/"])
  
   },
   err=>{
     this.alertify.error(err?.error)

   }
  )

 }

}
