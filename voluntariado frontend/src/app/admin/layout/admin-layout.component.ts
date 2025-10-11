import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  sidebarOpen = true;

  menuItems = [
    { route: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { route: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    { route: '/admin/eventos', label: 'Eventos', icon: '📅' },
    { route: '/admin/inscripciones', label: 'Inscripciones', icon: '✍️' },
    { route: '/admin/asistencias', label: 'Asistencias', icon: '✓' },
    { route: '/admin/recompensas', label: 'Recompensas', icon: '🎁' },
    { route: '/admin/canjes', label: 'Canjes', icon: '🏆' },
    { route: '/admin/certificados', label: 'Certificados', icon: '📜' }
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
