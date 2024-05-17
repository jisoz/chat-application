import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ErrorInterceptor } from '../core/interceptors/error.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([ErrorInterceptor])),
  ]
};
