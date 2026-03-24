import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private localstorageKey = 'jwt_token'

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private snack: MatSnackBar
  ) {
  }

  login(username: string, password: string): Observable<any> {
    return this.httpClient
      .post<any>(`${environment.apiUrl}/auth/token`, { username, password })
      .pipe(
        tap((response) => {
          if (response && response.token) {
            this.storeToken(response.token)
            this.router.navigate(['/admin'])
          }
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status == 403) {
            this.snack.open(err.error.message, "OK", { horizontalPosition: "right", verticalPosition: "top" })
          }
          return throwError(() => err)
        })
      )
  }

  logout(): void {
    localStorage.removeItem(this.localstorageKey)
    this.router.navigate(['/login'])
  }

  storeToken(token: string): void {
    localStorage.setItem(this.localstorageKey, token)
  }

  getToken(): string | null {
    var token = localStorage.getItem(this.localstorageKey)
    return token;
  }

  isLoggedIn(): boolean {
    var token = this.getToken()
    if (!token) {
      console.log("RETURNING FALSE")
      return false
    }

    var decoded_token = jwtDecode(token)
    var isTokenValid = decoded_token.exp! > Date.now() / 1000
    if (!isTokenValid) {
      this.logout()
    }

    return isTokenValid
  }
}
