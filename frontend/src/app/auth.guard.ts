import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth-service/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const authService = inject(AuthService)

  var isLoggedIn = authService.isLoggedIn()

  if (isLoggedIn) {
    return true
  }
  else {
    router.navigate(['/login'])
    return false
  }
};
