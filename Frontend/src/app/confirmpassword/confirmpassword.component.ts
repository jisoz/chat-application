import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertifyServiceService } from '../../services/alertify-service.service';

@Component({
  selector: 'app-confirmpassword',
  templateUrl: './confirmpassword.component.html',
  styleUrl: './confirmpassword.component.css'
})
export class ConfirmpasswordComponent {
  userId!: string;
  token!: string;

  constructor(private route: ActivatedRoute, private authservice:AuthService, private alertifyjs:AlertifyServiceService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
      try{
        this.authservice.verifyEmailForPasswordReset(this.userId, this.token).subscribe(
          (response) => {
           this.alertifyjs.success("email verified you can now reset your password")
          },
          (error) => {
           this.alertifyjs.error(error?.error);
          }
        );
      }catch(e){
       console.error(e);
      }
    
    });
  }
}
