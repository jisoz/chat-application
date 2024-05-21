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
  private loggedIn!: BehaviorSubject<boolean>
  constructor( private http:HttpClient) {
    const savedLoginState = localStorage.getItem('isLoggedIn') === 'true';
    this.loggedIn = new BehaviorSubject<boolean>(savedLoginState);
   }

   signUp(userobj:any){
    return this.http.post<any>(`${this.baseUrl}Register`, userobj)
   }

   isLoggedIn(): Observable<boolean> {
    
    return this.loggedIn.asObservable();
    
  }
  
  updateLoggedInState(status: boolean):void {
  
    this.loggedIn.next(status);
    localStorage.setItem('isLoggedIn', status.toString());
  }

  getCurrentLoginState(): boolean {
    return this.loggedIn.getValue();
  }

  getToken(): string | null {
    return localStorage.getItem('Token'); 
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
   
    return this.http.get(`${this.baseUrl}confirm-passwordreset?userId=${userId}&token=${token}`,{responseType:"text" as any});
  }
  
  verifyEmail(userId: string, token: string){
    return this.http.get(`${this.baseUrl}confirm-email?userId=${userId}&token=${token}`,{responseType:"text" as any});
  }
  setnewpasword(userId: string, body:any){
    const params = new HttpParams().set('userId', userId);
  return this.http.post<any>(`${this.baseUrl}reset-password` , body, {params, responseType:"text" as any}  )
  }
}


