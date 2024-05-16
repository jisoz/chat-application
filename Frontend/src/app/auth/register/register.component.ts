import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertifyServiceService } from '../../../services/alertify-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerationForm!: FormGroup;
  userSubmitted!: boolean;
  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private alertify: AlertifyServiceService ,
    private Route: Router
  ) { }
    
  ngOnInit(): void {
    this.createRegisterationForm();
  }

  createRegisterationForm() {
    this.registerationForm =  this.fb.group({
      fullName: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[$#@]).{8,}$/)]],
      confirmPassword: [null, Validators.required]


    }, { validator: this.passwordMatchValidator })
  }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
  
    if (!password || !confirmPassword) {
      return null;
    }
  
    return password.value === confirmPassword.value ? null : { mismatch: true };
  }

  onSubmit(){
    console.log(this.registerationForm.value)
    this.userSubmitted = true;
    if (this.registerationForm.valid) {
      this.authService.signUp(this.registerationForm.value).subscribe(
        res=>{
         this.alertify.success("User Registred");
      
        },err=>{
          this.alertify.error(err?.error.message);
        }
      )
    }
    
  }

  get fullName() {
    return this.registerationForm.get('fullName') as FormControl;
}


get email() {
    return this.registerationForm.get('email') as FormControl;
}
get password() {
    return this.registerationForm.get('password') as FormControl;
}
get confirmPassword(){
  return this.registerationForm.get('confirmPassword') as FormControl;
}

}
