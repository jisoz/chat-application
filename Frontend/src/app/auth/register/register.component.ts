import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AlertifyServiceService } from '../../../services/alertify-service.service';
import { Router } from '@angular/router';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerationForm!: FormGroup;
  userSubmitted!: boolean;
  countries: any[] = [];
  cities:any[]=[];

  currentStep: number = 0;
  currentPanel: number = 0;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private alertify: AlertifyServiceService ,
    private Route: Router,
    private countryService: CountryService
  ) { }
    
  ngOnInit(): void {
    this.createRegisterationForm();
    this.countryService.getCountries().subscribe(data => {
      this.countries = data;
    });

    this.country.valueChanges.subscribe(countryIso => {
      if (countryIso) {
        this.countryService.getCities(countryIso).subscribe(data => {
          this.cities = data;
        });
      }
    });
  }

  createRegisterationForm() {
    this.registerationForm =  this.fb.group({
      fullName: [null, [Validators.required, Validators.minLength(5)]],
      knownAs:[null, [Validators.required]],
      dateOfBirth:[null, [Validators.required]],
      city: [null, [Validators.required]],
      country: [null, [Validators.required]],
      gender:[null, [Validators.required]],
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
   
    this.userSubmitted = true;
    if (this.registerationForm.valid) {
      this.authService.signUp(this.registerationForm.value).subscribe(
        res=>{
        //  this.alertify.success("User Registred");
         this.alertify.success("An Email has been sent to you to confirm your registration plz check to login ");
      
        },err=>{
          this.alertify.error(err?.error.message);
        }
      )
    }
    
  }



  setStep(step: number) {
    this.currentStep = step;
    this.currentPanel = step / 25;
  }

  nextStep() {
    if (this.currentPanel < 4) {
      this.currentPanel++;
      this.currentStep = this.currentPanel * 25;
    }
  }

  prevStep() {
    if (this.currentPanel > 0) {
      this.currentPanel--;
      this.currentStep = this.currentPanel * 25;
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

get gender(){
  return this.registerationForm.get('gender') as FormControl;
}
get country(){
  return this.registerationForm.get('country') as FormControl;
}
get city(){
  return this.registerationForm.get('city') as FormControl;
}
get dateOfBirth(){
  return this.registerationForm.get('dateOfBirth') as FormControl;
}

get knownAs(){
  return this.registerationForm.get('knownAs') as FormControl;
}

}
