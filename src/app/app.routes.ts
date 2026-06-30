import { Routes } from '@angular/router';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'tasks',
        pathMatch: 'full'
    },
    {
        // ✦ loadComponent() — lazy loads the standalone component directly
        path: 'tasks',
        loadComponent: () =>
            import('./features/home-page/home')
                .then(m => m.Home)
    },
    {
        path: 'task/:id',
        loadComponent: () =>
            import('./features/task-detail/task-detail')
                .then(m => m.TaskDetail)
    },
];
