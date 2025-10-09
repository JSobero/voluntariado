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
    path: '**',
    redirectTo: ''
  }
];
