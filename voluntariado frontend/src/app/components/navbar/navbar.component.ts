import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // RouterModule para routerLink
import { CommonModule } from '@angular/common'; // CommonModule para *ngIf
import { AuthService } from '../../services/auth.service'; // Ajusta esta ruta si es necesario

@Component({
  selector: 'app-navbar',
  standalone: true,
  // ¡Importante! Añadir CommonModule y RouterModule
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  // Inyectamos el servicio de Auth y el Router
  authService = inject(AuthService);
  router = inject(Router);

  // --- Métodos que tu HTML ya estaba usando ---

  volverInicio(): void {
    this.router.navigate(['/']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  // --- Nuevo método para cerrar sesión ---

  onLogout(): void {
    this.authService.logout();
  }
}
