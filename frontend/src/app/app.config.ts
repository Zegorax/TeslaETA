import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptorService } from './services/jwt-interceptor/jwt-interceptor.service';
import { HttpErrorInterceptorService } from './services/http-error-interceptor/http-error-interceptor.service';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptorService, multi: true },

    importProvidersFrom(

      NgxMapboxGLModule.withConfig({
        accessToken: environment.mapboxToken
      })
    )
  ]
};
