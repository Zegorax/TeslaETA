import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, config, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptorService implements HttpInterceptor {

  constructor(
    private _authService: AuthService,
    private _snackbar: MatSnackBar
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err) {
          switch (err.status) {
            case 403:
              this._authService.logout()
              break;
            default:
              this._snackbar.open(`Unable to perform action. Reason: ${err.error.message}`, "OK", { horizontalPosition: "right", verticalPosition: "top" })
          }
        }

        return throwError(() => err)
      })
    )
  }
}
