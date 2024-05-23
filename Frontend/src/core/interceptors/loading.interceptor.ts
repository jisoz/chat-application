import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../../services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyservice=inject(BusyService);
  busyservice.Busy();
  return next(req).pipe(
   delay(1000),
   finalize(()=>{
    busyservice.idle();
   })
   
  );
};
