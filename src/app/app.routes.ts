import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReverseAuthGuard } from './_guards/reverse_auth.guard';
import { AuthGuard } from './_guards/auth.guard';
import { OurServicesComponent } from './pages/our-services/our-services.component';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

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
                path: 'our-services',
                component: OurServicesComponent,
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