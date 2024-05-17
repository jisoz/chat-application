import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyServiceService } from '../../services/alertify-service.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirmemail',
  templateUrl: './confirmemail.component.html',
  styleUrl: './confirmemail.component.css'
})
export class ConfirmemailComponent implements OnInit {
  userId!: string;
  token!: string;
  message!:string;
  constructor(private route: ActivatedRoute, private authservice:AuthService, private alertifyjs:AlertifyServiceService,private router:Router){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
      try{
        this.authservice.verifyEmail(this.userId, this.token).subscribe(
          (response) => {
           
              this.message = "your email is verified you can now login "
              this.alertifyjs.success("verified");
            
           
          },
      
        );
      }catch(e){
       console.error(e);
      }
  }
    )
}
}
