import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

// Define la interfaz para el usuario (puedes moverla a un archivo de 'interfaces')
export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  rol: { nombre: string };
  password?: string;
  // ... puedes añadir 'password', 'telefono', etc., si los necesitas en el frontend
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // 1. EL ESTADO CENTRAL
  // Usamos un 'signal' para guardar el usuario actual.
  // Cuando esto cambie, cualquier componente que lo "escuche" se actualizará.
  currentUser = signal<Usuario | null>(null);

  constructor(private router: Router) {
    // 2. REVISAR AL INICIAR
    // Cuando la app carga, revisa si ya hay un usuario en localStorage.
    this.cargarUsuarioDesdeStorage();
  }

  private cargarUsuarioDesdeStorage(): void {
    // Verificamos que 'localStorage' esté disponible (importante para Angular Universal/SSR)
    if (typeof localStorage !== 'undefined') {
      const usuarioData = localStorage.getItem('currentUser');
      if (usuarioData) {
        // Si encontramos un usuario, actualizamos el signal
        this.currentUser.set(JSON.parse(usuarioData));
      }
    }
  }

  // 3. MÉTODO DE LOGIN
  // Tu LoginComponent llamará a esto.
  login(usuario: Usuario): void {
    // Guarda en localStorage para persistir la sesión si recarga la página
    localStorage.setItem('currentUser', JSON.stringify(usuario));

    // ¡LA PARTE CLAVE! Actualiza el signal.
    // Esto avisará al Navbar (y a cualquier otro componente) que el usuario cambió.
    this.currentUser.set(usuario);

    // Mueve la lógica de redirección aquí
    if (usuario.rol.nombre === 'ADMIN' || usuario.rol.nombre === 'ORGANIZADOR') {
      this.router.navigate(['/admin/dashboard']);
    } else {
      // Usamos la ruta raíz '/' como acordamos
      this.router.navigate(['/']);
    }
  }

  // 4. MÉTODO DE LOGOUT
  // Tu Navbar llamará a esto.
  logout(): void {
    // Limpia el localStorage
    localStorage.removeItem('currentUser');

    // Actualiza el signal a 'null'
    this.currentUser.set(null);

    // Envía al usuario a la página principal
    this.router.navigate(['/']);
  }
}
