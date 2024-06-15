import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { BusyService } from '../../services/busy.service';
import { delay, finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
   const busyService = inject(BusyService);


  const excludedUrls = [
    'http://localhost:5197/api/Account/is-online',
    'https://api.countrystatecity.in/v1/countries',
    'https://api.countrystatecity.in/v1',
    "http://localhost:5197/api/likes"

    
  ];

  
  const isExcluded = excludedUrls.some(url => req.url.includes(url));

  if (!isExcluded) {
    busyService.Busy();
  }

  return next(req).pipe(
    delay(1000),
    finalize(() => {
      if (!isExcluded) {
        busyService.idle();
      }
    })
  );
};
