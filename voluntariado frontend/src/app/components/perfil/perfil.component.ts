import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService, Usuario } from '../../services/auth.service';
import { Canje } from '../../core/models/canje.model';

interface Inscripcion {
  id: number;
  evento: any;
  estado: string;
  solicitadoEn: string;
}

interface Certificado {
  id: number;
  evento: any;
  urlPdf?: string;
  fechaEmision: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);

  private readonly API_BASE = 'http://localhost:8080';

  usuarioActual: Usuario | null = null;
  inscripciones: Inscripcion[] = [];
  certificados: Certificado[] = [];
  canjes: Canje[] = [];

  isLoading = true;
  error: string | null = null;
  editMode = false;
  usuarioEditado: Partial<Usuario> = {};
  tabActiva: 'resumen' | 'eventos' | 'certificados' | 'configuracion' | 'canjes' = 'resumen';

  ngOnInit(): void {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil(): void {
    this.isLoading = true;
    this.error = null;
    const usuarioLogueado = this.authService.currentUser();

    if (usuarioLogueado) {
        this.usuarioActual = usuarioLogueado;
        this.cargarInscripciones();
        this.cargarCertificados();
        this.cargarCanjes();
        this.isLoading = false;
    } else {
        this.router.navigate(['/login']);
    }
  }

  cargarInscripciones(): void {
    if (!this.usuarioActual) return;

    this.http.get<Inscripcion[]>(
      `${this.API_BASE}/inscripciones/usuario/${this.usuarioActual.id}`
    ).subscribe({
      next: (data) => {
        this.inscripciones = data;
      },
      error: (err) => console.error('Error al cargar inscripciones:', err)
    });
  }

  cargarCertificados(): void {
    if (!this.usuarioActual) return;

    this.http.get<Certificado[]>(`${this.API_BASE}/certificados`).subscribe({
      next: (data) => {
        this.certificados = data.filter(
           cert => cert.evento?.organizador?.id === this.usuarioActual?.id
        );
      },
      error: (err) => console.error('Error al cargar certificados:', err)
    });
  }

  cargarCanjes(): void {
    if (!this.usuarioActual) return;

    this.http.get<Canje[]>(
      `${this.API_BASE}/canjes/usuario/${this.usuarioActual.id}`
    ).subscribe({
      next: (data) => {
        this.canjes = data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      },
      error: (err) => console.error('Error al cargar canjes:', err)
    });
  }
  
  cambiarTab(tab: 'resumen' | 'eventos' | 'certificados' | 'configuracion' | 'canjes'): void {
    this.tabActiva = tab;
  }

  activarEdicion(): void {
    if (!this.usuarioActual) return;
    this.editMode = true;
    this.usuarioEditado = {
      nombre: this.usuarioActual.nombre,
      correo: this.usuarioActual.correo
    };
  }

  cancelarEdicion(): void {
    this.editMode = false;
    this.usuarioEditado = {};
  }

  guardarCambios(): void {
    if (!this.usuarioActual) return;

    const usuarioActualizado = {
      ...this.usuarioActual,
      ...this.usuarioEditado
    };

    this.http.put<Usuario>(
      `${this.API_BASE}/usuarios/${this.usuarioActual.id}`,
      usuarioActualizado
    ).subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
        this.authService.currentUser.set(usuario);
        localStorage.setItem('currentUser', JSON.stringify(usuario));

        this.editMode = false;
        alert('Perfil actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar el perfil');
      }
    });
  }

  descargarCertificado(certificado: Certificado): void {
    if (certificado.urlPdf) {
      window.open(certificado.urlPdf, '_blank');
    } else {
      alert('Este certificado no tiene archivo disponible');
    }
  }

 formatearFecha(fecha: string | number[] | null | undefined): string {
     if (!fecha) return 'Fecha desconocida';

     let fechaObj: Date;
     if (Array.isArray(fecha)) {
       fechaObj = new Date(
         fecha[0],
         fecha[1] - 1,
         fecha[2],
         fecha[3] || 0,
         fecha[4] || 0,
         fecha[5] || 0
       );
     }
     else {
       fechaObj = new Date(fecha);
     }

     if (isNaN(fechaObj.getTime())) {
       return 'Fecha inválida';
     }

     return fechaObj.toLocaleDateString('es-ES', {
       day: '2-digit',
       month: 'short',
       year: 'numeric'
     });
   }

  obtenerClaseEstado(estado: string): string {
    switch(estado) {
      case 'ACEPTADA': return 'estado-aceptada';
      case 'PENDIENTE': return 'estado-pendiente';
      case 'RECHAZADA': return 'estado-rechazada';
      default: return '';
    }
  }

  obtenerClaseEstadoCanje(estado: string): string {
    switch(estado) {
      case 'ENTREGADO': return 'estado-aceptada';
      case 'PENDIENTE': return 'estado-pendiente';
      case 'CANCELADO': return 'estado-rechazada';
      default: return '';
    }
  }

  navegarEventos(): void {
    this.router.navigate(['/eventos']);
  }
  navegarRecompensas(): void {
    this.router.navigate(['/recompensas']);
  }
}
