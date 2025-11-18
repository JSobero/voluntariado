import { Component, inject } from '@angular/core';
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
  menuAbierto = false;

  toggleMenu(): void {
      this.menuAbierto = !this.menuAbierto;
    }


  volverInicio(): void {
    this.router.navigate(['/']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }


  onLogout(): void {
    this.authService.logout();
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}
