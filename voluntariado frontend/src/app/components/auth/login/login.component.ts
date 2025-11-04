import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface LoginCredentials {
  correo: string;
  password: string;
}

interface LoginResponse {
  usuario: {
    id: number;
    nombre: string;
    correo: string;
    rol: { nombre: string };
  };
  token?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: LoginCredentials = {
    correo: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.credentials.correo || !this.credentials.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Simulación de login - buscar usuario por correo y validar password
    this.http.get<any[]>('http://localhost:8080/usuarios').subscribe({
      next: (usuarios) => {
        const usuario = usuarios.find(u =>
          u.correo === this.credentials.correo &&
          u.password === this.credentials.password
        );

        if (usuario) {
          // Login exitoso
          localStorage.setItem('currentUser', JSON.stringify(usuario));

          // Redirigir según el rol
          if (usuario.rol.nombre === 'ADMIN' || usuario.rol.nombre === 'ORGANIZADOR') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          this.errorMessage = 'Correo o contraseña incorrectos';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
