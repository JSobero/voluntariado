import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Inscripcion } from '../../core/models/inscripcion.model';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-inscripciones.component.html',
  styleUrls: ['./mis-inscripciones.component.css']
})
export class MisInscripcionesComponent implements OnInit {
  private inscripcionService = inject(InscripcionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  misInscripciones: Inscripcion[] = [];
  cargando = true;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.cargarMisInscripciones();
  }

  cargarMisInscripciones() {
    this.cargando = true;

    const usuarioActual = this.authService.currentUser();

    if (!usuarioActual) {
      this.error = "No estás autenticado para ver esta página.";
      this.cargando = false;
      this.router.navigate(['/login']);
      return;
    }

    const usuarioId = usuarioActual.id;

    this.inscripcionService.getByUsuario(usuarioId).subscribe({
      next: (datos) => {

        this.misInscripciones = datos.map(inscripcion => ({
          ...inscripcion,
          evento: {
            ...inscripcion.evento,
            fechaInicio: this.convertirFecha(inscripcion.evento.fechaInicio)
          },
          solicitadoEn: this.convertirFecha(inscripcion.solicitadoEn)
        }));

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar inscripciones:', err);
        this.error = 'No se pudieron cargar tus inscripciones.';
        this.cargando = false;
      }
    });
  }

  convertirFecha(fechaTexto: any): string {
    if (!fechaTexto) return '';
    if (Array.isArray(fechaTexto) && fechaTexto.length >= 3) {
      const [año, mes, día, hora = 0, minuto = 0, segundo = 0] = fechaTexto;
      const fecha = new Date(año, mes - 1, día, hora, minuto, segundo);
      return fecha.toISOString();
    }
    if (typeof fechaTexto === 'string') {
      return fechaTexto;
    }
    return '';
  }
  obtenerClaseEstado(estado: string): string {
    switch(estado) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'ACEPTADA':
        return 'estado-aceptada';
      case 'RECHAZADA':
        return 'estado-rechazada';
      default:
        return 'estado-default';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch(estado) {
      case 'PENDIENTE':
        return '⏳';
      case 'ACEPTADA':
        return '✅';
      case 'RECHAZADA':
        return '❌';
      default:
        return '❓';
    }
  }

  verDetalleEvento(eventoId: number): void {
    this.router.navigate(['/eventos', eventoId]);
  }
irAEventos(): void {
    this.router.navigate(['/eventos']);
  }
}
