// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
  },
  // Aquí puedes agregar más rutas cuando crees otros componentes
  // {
  //   path: 'eventos',
  //   loadComponent: () => import('./components/eventos/eventos.component').then(m => m.EventosComponent)
  // },
  // {
  //   path: 'recompensas',
  //   loadComponent: () => import('./components/recompensas/recompensas.component').then(m => m.RecompensasComponent)
  // },
  // {
  //   path: 'perfil',
  //   loadComponent: () => import('./components/perfil/perfil.component').then(m => m.PerfilComponent)
  // },
  {
    path: '**',
    redirectTo: '/home'  // Redirect para rutas no encontradas
  }
];