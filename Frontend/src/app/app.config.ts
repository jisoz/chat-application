import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorInterceptor } from '../core/interceptors/error.interceptor';
import { jwtInterceptor } from '../core/interceptors/jwtinterceptor.interceptor';
import { loadingInterceptor } from '../core/interceptors/loading.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([ErrorInterceptor])),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideHttpClient(withInterceptors([loadingInterceptor])),
    
  ]
};
