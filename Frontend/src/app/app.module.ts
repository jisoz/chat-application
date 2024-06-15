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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { appConfig } from './app.config';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ServererrorComponent } from './servererror/servererror.component';
import { ConfirmemailComponent } from './confirmemail/confirmemail.component';
import { MemberCardComponent } from './member-card/member-card.component';
import { MemeberDetailComponent } from './memeber-detail/memeber-detail.component';
import {TabsModule} from 'ngx-bootstrap/tabs';

import { MemeberEditComponent } from './memeber-edit/memeber-edit.component';
import { preventUnsavedChangesGuard } from '../guards/prevent-unsaved-changes.guard';
import { NgxSpinner, NgxSpinnerModule } from 'ngx-spinner';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import {PaginationModule} from 'ngx-bootstrap/pagination'
import { loginGardGuard } from '../guards/login-gard.guard';
import { TimeagoModule } from 'ngx-timeago';
import { NotificationComponent } from './notification/notification.component';
const appRoutes: Routes = [
  {path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent , canActivate: [loginGardGuard] },
  {path: '',
    runGuardsAndResolvers:'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MatcheComponent},
      {path: 'members/:username', component:MemeberDetailComponent}, 
      {path: 'member/edit', component:MemeberEditComponent, canDeactivate:[preventUnsavedChangesGuard]}, 
      { path: 'lists', component: ListComponent },
      { path: 'messages', component: MessageComponent }

    ]
  },
  { path: 'register', component: RegisterComponent },
  {path: 'resetpassword', component:ForgetPasswordComponent},
  {path: 'confirm-passwordreset', component: ConfirmpasswordComponent},
  {path: 'confirm-email', component: ConfirmemailComponent},
  {path: 'unauthorized404', component: UnauthorizedComponent},
  {path:'servererror', component: ServererrorComponent},
  // {path:'notification', component: NotificationComponent},


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
    UnauthorizedComponent,
    ServererrorComponent,
    ConfirmemailComponent,
    MemberCardComponent,
    MemeberDetailComponent,
    MemeberEditComponent,
    PhotoEditorComponent,
    NotificationComponent,
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
    TabsModule.forRoot(),
    NgxGalleryModule,
    NgxSpinnerModule,
    FileUploadModule,
    PaginationModule.forRoot(),
    TimeagoModule.forRoot(),
    
  ],
  providers: [AuthService, appConfig.providers ],
  bootstrap: [AppComponent]
})
export class AppModule { }
