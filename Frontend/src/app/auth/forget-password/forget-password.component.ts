import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { AlertifyServiceService } from '../../../services/alertify-service.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrl: './forget-password.component.css'
})
export class ForgetPasswordComponent {
  loading = false;
  constructor(private authservice:AuthService , private alertify:AlertifyServiceService, private route:Router){}

  onSubmit(submitForm: NgForm) {
    this.loading = true; 
    try{
      this.authservice.resetpassword(submitForm.value).subscribe(
        (res:any)=> {
          console.log(res);
          this.alertify.success('Email successfully Sent! Check your email');
          this.loading = false;
        },
        (error)=>{
          this.alertify.error(error);
          this.loading = false;
        }
      );
    }
    catch(e){
      console.error(e);
    }
    
  }
  
}
