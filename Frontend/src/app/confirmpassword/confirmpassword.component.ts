import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertifyServiceService } from '../../services/alertify-service.service';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirmpassword',
  templateUrl: './confirmpassword.component.html',
  styleUrl: './confirmpassword.component.css'
})
export class ConfirmpasswordComponent {
  userId!: string;
  token!: string;
  registerationForm!: FormGroup;
  userSubmitted!: boolean;
  constructor(private route: ActivatedRoute, private authservice:AuthService, private alertifyjs:AlertifyServiceService, private fb: FormBuilder, private router:Router) { }

  ngOnInit(): void {
    this.createRegisterationForm();

    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'];
      this.token = params['token'];
      try{
        this.authservice.verifyEmailForPasswordReset(this.userId, this.token).subscribe(
          (response) => {
           this.alertifyjs.success("email verified you can now reset your password")
          },
      
        );
      }catch(e){
       console.error(e);
      }
    
    });
  }

  createRegisterationForm() {
    this.registerationForm =  this.fb.group({
      newPassword: [null, [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$#@]).{8,}$/)]],
      confirmNewPassword: [null, Validators.required]


    }, { validator: this.passwordMatchValidator })
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword');
    const confirmNewPassword = formGroup.get('confirmNewPassword');
  
    if (!newPassword || !confirmNewPassword) {
      return null;
    }
  
    return newPassword.value === confirmNewPassword.value ? null : { mismatch: true };
  }


  onSubmit(){

    this.userSubmitted = true;
 console.log( this.registerationForm.value)

    try{
      this.authservice.setnewpasword(this.userId, this.registerationForm.value).subscribe(
        res=>{
         this.alertifyjs.success("password updated successfully");
         this.router.navigate(['/login']);
        },
        err=>{
          this.alertifyjs.error(err.error);
        }
        
      )
    }catch(e){
      console.error(e);
    }
    
    

  }

  get newPassword() {
    return this.registerationForm.get('newPassword') as FormControl;
}
 get confirmNewPassword(){
  return this.registerationForm.get('confirmNewPassword') as FormControl;
}
}
