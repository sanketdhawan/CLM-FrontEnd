import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ReverseAuthGuard } from './_guards/reverse_auth.guard';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { CreateContractComponent } from './pages/contracts/create-contract/create-contract.component';
import { ClosedContractComponent } from './pages/contracts/closed-contract/closed-contract.component';
import { EditContractComponent } from './pages/contracts/edit-contract/edit-contract.component';

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
                path: 'contracts/drafts',
                component: ContractsComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'contracts/initiate',
                component: CreateContractComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'contracts/closed',
                component: ClosedContractComponent,
                canActivate: [AuthGuard],
            },
            { path: 'contracts/edit/:id', component: EditContractComponent, canActivate: [AuthGuard], },
            {
                path: '',
                component: CreateContractComponent,
                canActivate: [AuthGuard],
            },
        ],
    },
    { path: '**', redirectTo: '/', pathMatch: 'full' },
];