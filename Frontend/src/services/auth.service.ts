import { HttpClient ,HttpHeaders,HttpErrorResponse, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


interface ResetPasswordDto {
  newPassword: string;
  confirmNewPassword: string;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string="http://localhost:5197/api/Account/" ;

 
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.checkInitialLoginState());
  private currentusersource =new ReplaySubject<any>(1);
  currentuser$=this.currentusersource.asObservable();
  constructor( private http:HttpClient) {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentusersource.next(JSON.parse(user));
      this.loggedIn.next(true);
    } else {
      this.loggedIn.next(false);
    }
   
   }

   private checkInitialLoginState(): boolean {
    const user = localStorage.getItem('user');
    return user !== null;
  }
   signUp(userobj:any){
    return this.http.post<any>(`${this.baseUrl}Register`, userobj).pipe(
      map((response:any)=>{
        const user=response;
        if(user){
          // this.setcurrentuser(user);
          return ;
        }
      }
      
    )
  )
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

    const user = localStorage.getItem('user');
  if (user) {
    try {
      const userObj = JSON.parse(user);
      return userObj.token || null;
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  }
  return null;
  }
   signin(userobj:any){
    return this.http.post<any>(`${this.baseUrl}Login`, userobj).pipe(
    map((response:any)=>{
      const user=response;
      if(user){
        this.setcurrentuser(user);
        this.updateLoggedInState(true);
      }
    }

    )
    )
   }

   setcurrentuser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
  this.currentusersource.next(user);
   }
   logout(){
    localStorage.removeItem('user');
    this.updateLoggedInState(false);
    localStorage.removeItem('isLoggedIn');
    this.currentusersource.next(null);
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
    let head_obj=new HttpHeaders().set("Authorization","Bearer " +token);
    return this.http.get(`${this.baseUrl}confirm-passwordreset?userId=${userId}&token=${token}`,{responseType:"text" as any,headers: head_obj});
  }
  
  verifyEmail(userId: string, token: string){
    let head_obj=new HttpHeaders().set("Authorization","Bearer " +token);
    return this.http.get(`${this.baseUrl}confirm-email?userId=${userId}&token=${token}`,{responseType:"text" as any,headers: head_obj});
  }
  setnewpasword(userId: string, body:any){
    const params = new HttpParams().set('userId', userId);
  return this.http.post<any>(`${this.baseUrl}reset-password` , body, {params, responseType:"text" as any}  )
  }


  isUserOnline(userId: number): Observable<{ isOnline: boolean }> {
    return this.http.get<{ isOnline: boolean }>(`${this.baseUrl}is-online/${userId}`);
  }

}


