import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, Usuario } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';

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
    private router: Router,
    private authService: AuthService
  ) {}

  onSubmit(): void {
    if (!this.credentials.correo || !this.credentials.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<Usuario[]>(`${environment.apiUrl}/usuarios`).subscribe({
          next: (usuarios) => {
            const usuario = usuarios.find(u =>
              u.correo === this.credentials.correo &&
              u.password === this.credentials.password
            );

            if (usuario) {
              this.authService.login(usuario);
              // ---------------------------------
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
