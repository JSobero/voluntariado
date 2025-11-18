import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: { nombre: string };
  password?: string;
  telefono?: string;
  puntos: number;
  horasAcumuladas: number;
  creadoEn: string;

}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser = signal<Usuario | null>(null);

  constructor(private router: Router) {
    this.cargarUsuarioDesdeStorage();
  }

  private cargarUsuarioDesdeStorage(): void {
    if (typeof localStorage !== 'undefined') {
      const usuarioData = localStorage.getItem('currentUser');
      if (usuarioData) {
        this.currentUser.set(JSON.parse(usuarioData));
      }
    }
  }

  login(usuario: Usuario): void {
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    this.currentUser.set(usuario);
    if (usuario.rol.nombre === 'ADMIN' || usuario.rol.nombre === 'ORGANIZADOR') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUser.set(null);
    this.router.navigate(['/']);
  }

  logoutConConfirmacion(): void {
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');

    if (confirmar) {
      localStorage.removeItem('currentUser');
      this.currentUser.set(null);
      this.router.navigate(['/']);
      console.log('Sesión cerrada exitosamente');
    }
}
}
