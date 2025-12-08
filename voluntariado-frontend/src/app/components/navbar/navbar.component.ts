import { Component, inject, HostListener } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  authService = inject(AuthService);
  router = inject(Router);
  userMenuAbierto = false;
  mobileMenuOpen = false;

  // Cerrar menús al hacer clic fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const navbar = document.querySelector('.navbar');

    // Si el clic es fuera del navbar, cerrar los menús
    if (navbar && !navbar.contains(target)) {
      this.userMenuAbierto = false;
      this.mobileMenuOpen = false;
    }
  }

  // Cerrar menús al presionar Escape
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.userMenuAbierto = false;
    this.mobileMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.userMenuAbierto = !this.userMenuAbierto;
    // Cerrar menú móvil si está abierto
    if (this.userMenuAbierto) {
      this.mobileMenuOpen = false;
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Cerrar menú de usuario si está abierto
    if (this.mobileMenuOpen) {
      this.userMenuAbierto = false;
    }
  }

  volverInicio(): void {
    this.router.navigate(['/']);
    this.mobileMenuOpen = false;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.mobileMenuOpen = false;
    this.userMenuAbierto = false;
  }

  onLogout(): void {
    this.authService.logout();
    this.userMenuAbierto = false;
    this.mobileMenuOpen = false;
  }

  cerrarUserMenu(): void {
    this.userMenuAbierto = false;
  }
}
