// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main/main.component').then(m => m.LandingComponent)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./components/eventos/eventos.component').then(m => m.EventosComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  // Rutas futuras que necesitarás crear
  // {
  //   path: 'login',
  //   loadComponent: () => import('./components/auth/login/login.component').then(m => m.LoginComponent)
  // },
  // {
  //   path: 'register',
  //   loadComponent: () => import('./components/auth/register/register.component').then(m => m.RegisterComponent)
  // },
  // {
  //   path: 'eventos',
  //   loadComponent: () => import('./components/eventos/eventos.component').then(m => m.EventosComponent)
  // },
  {
      path: 'admin',
      loadComponent: () =>
        import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
      // Aquí puedes agregar un guard de autenticación después
      // canActivate: [AuthGuard],
      children: [
        {
          path: 'dashboard',
          loadComponent: () =>
            import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
        },
        {
          path: 'usuarios',
          loadComponent: () =>
            import('./admin/usuarios/usuarios-list.component').then(m => m.UsuariosListComponent)
        },
        {
          path: 'eventos',
          loadComponent: () =>
            import('./admin/eventos/eventos-list.component').then(m => m.EventosListComponent)
        },
        {
          path: 'inscripciones',
          loadComponent: () =>
            import('./admin/inscripciones/inscripciones-list.component').then(m => m.InscripcionesListComponent)
        },
        {
          path: 'asistencias',
          loadComponent: () =>
            import('./admin/asistencias/asistencias-list.component').then(m => m.AsistenciasListComponent)
        },
        {
          path: 'recompensas',
          loadComponent: () =>
            import('./admin/recompensas/recompensas-list.component').then(m => m.RecompensasListComponent)
        },
        {
          path: 'canjes',
          loadComponent: () =>
            import('./admin/canjes/canjes-list.component').then(m => m.CanjesListComponent)
        },
        {
          path: 'certificados',
          loadComponent: () =>
            import('./admin/certificados/certificados-list.component').then(m => m.CertificadosListComponent)
        },
        {
          path: '',
          redirectTo: 'dashboard',
          pathMatch: 'full'
        }
      ]
    },
  {

    path: '**',
    redirectTo: ''
  }
];
