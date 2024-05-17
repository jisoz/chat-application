import { HttpEvent, HttpHandler, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

// export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);
//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {
//       console.log("Intercepting Request with Error");
//       if (error.status === 401) {
//         console.log("Error 401: Unauthorized", error.message);
//         router.navigate(['/unauthorized']);
//       }
//       return throwError(() => error);
//     })
//   );
// };

export const ErrorInterceptor: HttpInterceptorFn = (req, next)=> {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log("Intercepting Request with Error", error);

      if (error.status === 0 || error.status==401 || error.error=="Email Not Verified") {
        console.log("Error 401: Unauthorized", error.message);
        router.navigate(['/unauthorized404']);
      }else if(error.status === 500){
        router.navigate(['/servererror']);
      }
     
      return throwError(() => error);
    })
  );
};

