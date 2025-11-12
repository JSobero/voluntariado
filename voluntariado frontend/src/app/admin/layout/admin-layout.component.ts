// voluntariado frontend/src/app/admin/layout/admin-layout.component.ts
import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AuthService, Usuario } from '../../services/auth.service';
import { TemaService} from '../../services/tema.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  sidebarOpen = true;
  userMenuOpen = false;
  pageTitle = 'Dashboard';
  breadcrumb = 'Dashboard';
  public isDarkMode$: Observable<boolean>;
  // ✅ Usa el signal de tu AuthService existente
  usuarioActual = computed(() => this.authService.currentUser());

  menuItems = [
    { route: '/admin/dashboard', label: 'Dashboard', icon: 'bi bi-speedometer2', title: 'Dashboard' },
    { route: '/admin/usuarios', label: 'Usuarios', icon: 'bi bi-people-fill', title: 'Gestión de Usuarios' },
    { route: '/admin/eventos', label: 'Eventos', icon: 'bi bi-calendar-event', title: 'Gestión de Eventos' },
    { route: '/admin/inscripciones', label: 'Inscripciones', icon: 'bi bi-clipboard-check', title: 'Gestión de Inscripciones' },
    { route: '/admin/asistencias', label: 'Asistencias', icon: 'bi bi-patch-check-fill', title: 'Gestión de Asistencias' },
    { route: '/admin/recompensas', label: 'Recompensas', icon: 'bi bi-gift-fill', title: 'Gestión de Recompensas' },
    { route: '/admin/canjes', label: 'Canjes', icon: 'bi bi-trophy-fill', title: 'Gestión de Canjes' },
    { route: '/admin/certificados', label: 'Certificados', icon: 'bi bi-patch-plus-fill', title: 'Gestión de Certificados' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private themeService: TemaService
  ) {

    this.isDarkMode$ = this.themeService.isDark$;
    // Actualizar título según la ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        const currentRoute = this.router.url;
        const activeItem = this.menuItems.find(item => item.route === currentRoute);
        return activeItem ? activeItem.title : 'Dashboard';
      })
    ).subscribe((title: string) => {
      this.pageTitle = title;
      this.breadcrumb = title;
    });
  }

  ngOnInit(): void {
    // El usuario ya está en el signal, no necesitas hacer nada más aquí
    // Si no hay usuario, el guard debería redirigir al login
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  // ✅ Usa el nuevo método con confirmación
  cerrarSesion(): void {
    this.authService.logoutConConfirmacion();
  }

  irAConfiguracion(): void {
    this.userMenuOpen = false;
    this.router.navigate(['/admin/configuracion']);
  }

  irAPerfil(): void {
    this.userMenuOpen = false;
    this.router.navigate(['/admin/perfil']);
  }
}
