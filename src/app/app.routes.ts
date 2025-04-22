import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReverseAuthGuard } from './_guards/reverse_auth.guard';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [ReverseAuthGuard] },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [ReverseAuthGuard],
    },
    {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AuthGuard],
            },
            {
                path: '',
                component: DashboardComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' },
];