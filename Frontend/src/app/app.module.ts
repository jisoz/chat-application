import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './home/home.component';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatcheComponent } from './matche/matche.component';
import { MessageComponent } from './message/message.component';
import { ListComponent } from './list/list.component';
import { AuthGuard } from '../guards/auth.guard';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ConfirmpasswordComponent } from './confirmpassword/confirmpassword.component';

const appRoutes: Routes = [
  {path: '', component: HomeComponent ,   runGuardsAndResolvers:'always',  canActivate: [AuthGuard]},
  {path: '',
    runGuardsAndResolvers:'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MatcheComponent},
      { path: 'lists', component: ListComponent },
      { path: 'messages', component: MessageComponent }

    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'resetpassword', component:ForgetPasswordComponent},
  {path: 'confirm-passwordreset', component: ConfirmpasswordComponent}



];


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AuthComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,

    MatcheComponent,
    MessageComponent,
    ListComponent,
    ForgetPasswordComponent,
    ConfirmpasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule,
    ProgressSpinnerModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
