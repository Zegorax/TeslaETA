import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/auth-service/auth.service';
import { Router } from '@angular/router';


@Component({
    selector: 'app-login',
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatCardModule,
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(private _authService: AuthService, private _router: Router) { }

  public username = '';
  public password = '';
  public loginValid = true;

  ngOnInit() {
    if (this._authService.isLoggedIn()) {
      this._router.navigate(["/admin"])
    }
  }

  public onSubmit(): void {
    this._authService.login(this.username, this.password).subscribe(res => {
      console.log(res)
    })
  }

}
