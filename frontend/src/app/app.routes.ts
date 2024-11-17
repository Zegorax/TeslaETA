import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { ViewerComponent } from './viewer/viewer.component';

export const routes: Routes = [
    { path: 'admin', component: AdminComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', component: ViewerComponent }
];
