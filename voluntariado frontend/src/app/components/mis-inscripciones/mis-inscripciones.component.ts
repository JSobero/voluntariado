import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Inscripcion } from '../../core/models/inscripcion.model'; // Ajusta la ruta a tu modelo
import { InscripcionService } from '../../core/services/inscripcion.service'; // Ajusta la ruta
import { AuthService } from '../../services/auth.service'; // Ajusta la ruta

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para *ngFor, *ngIf y | date
  templateUrl: './mis-inscripciones.component.html',
  styleUrls: ['./mis-inscripciones.component.css']
})
export class MisInscripcionesComponent implements OnInit {
  // Inyectamos los servicios
  private inscripcionService = inject(InscripcionService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Variables para la vista
  misInscripciones: Inscripcion[] = [];
  cargando = true;
  error: string | null = null;

  constructor() {}

  ngOnInit() {
    this.cargarMisInscripciones();
  }

  cargarMisInscripciones() {
    this.cargando = true;

    // 1. Obtenemos el usuario actual del AuthService
    const usuarioActual = this.authService.currentUser();

    if (!usuarioActual) {
      // Si no hay usuario, no podemos hacer nada.
      this.error = "No estás autenticado para ver esta página.";
      this.cargando = false;
      this.router.navigate(['/login']); // Lo mandamos al login
      return;
    }

    const usuarioId = usuarioActual.id;

    // 2. Llamamos al método que YA TENÍAS en tu servicio
    this.inscripcionService.getByUsuario(usuarioId).subscribe({
      next: (datos) => {
        // 3. ¡Convertimos las fechas! (El mismo error de siempre)
        this.misInscripciones = datos.map(inscripcion => ({
          ...inscripcion,
          // Convertimos la fecha del evento y la de la solicitud
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

  // 4. Copiamos la función de conversión de fechas (¡Esencial!)
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

  // 5. (Opcional) Funciones de ayuda para los estilos del estado
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
        return '⏳'; // Reloj de arena
      case 'ACEPTADA':
        return '✅'; // Check verde
      case 'RECHAZADA':
        return '❌'; // X roja
      default:
        return '❓';
    }
  }

  // 6. (Opcional) Función para navegar al evento
  verDetalleEvento(eventoId: number): void {
    // Asumiendo que tienes una ruta /eventos/:id
    this.router.navigate(['/eventos', eventoId]);
  }
irAEventos(): void {
    this.router.navigate(['/eventos']);
  }
}
