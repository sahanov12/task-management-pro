import { Routes } from '@angular/router';
import { authGuard } from './services/auth.guard';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./features/login/login')
                .then(m => m.LoginComponent)
    },
    {
        // ✦ loadComponent() — lazy loads the standalone component directly
        path: 'tasks',
        loadComponent: () =>
            import('./features/home-page/home')
                .then(m => m.Home),
        canActivate: [authGuard]
    },
    {
        path: 'task/:id',
        loadComponent: () =>
            import('./features/task-detail/task-detail')
                .then(m => m.TaskDetail),
        canActivate: [authGuard]
    },
];
