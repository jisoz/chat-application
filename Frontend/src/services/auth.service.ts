import { HttpClient ,HttpHeaders,HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface ResetPasswordDto {
  newPassword: string;
  confirmNewPassword: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string="http://localhost:5197/api/Account/"
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor( private http:HttpClient) {
   }

   signUp(userobj:any){
    return this.http.post<any>(`${this.baseUrl}Register`, userobj)
   }

   isLoggedIn(): BehaviorSubject<boolean> {
    return this.loggedIn;
  }
  
  updateLoggedInState(status: boolean) {
    this.loggedIn.next(status);
  }
   signin(userobj:any){
    return this.http.post<any>(`${this.baseUrl}Login`, userobj).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Handle 404 error (user not found)
          alert('User not found');
        }
        return throwError(error);
      })
    )
   }


   resetpassword(email: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}forgot-password`,  email,{responseType:"text" as any} )
    .pipe( 
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );
  }

  verifyEmailForPasswordReset(userId: string, token: string) {
    let head_obj=new HttpHeaders().set("Authorization","bearer " +token);
    return this.http.get(`${this.baseUrl}confirm-passwordreset?userId=${userId}&token=${token}`,{headers: head_obj,responseType:"text" as any});
  }
  
  verifyEmail(userId: string, token: string){
    let head_obj=new HttpHeaders().set("Authorization","bearer " +token);
    return this.http.get(`${this.baseUrl}confirm-email?userId=${userId}&token=${token}`,{headers: head_obj,responseType:"text" as any});
  }
  setnewpasword(userId: string, body:any){
    const params = new HttpParams().set('userId', userId);
  return this.http.post<any>(`${this.baseUrl}reset-password` , body, {params, responseType:"text" as any}  )
  }
}


