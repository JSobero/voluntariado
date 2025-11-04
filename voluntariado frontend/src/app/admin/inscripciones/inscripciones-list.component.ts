import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { Inscripcion } from '../../core/models/inscripcion.model';

@Component({
  selector: 'app-inscripciones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inscripciones-list.component.html',
  styleUrls: ['./inscripciones-list.component.css']
})
export class InscripcionesListComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  inscripcionesFiltradas: Inscripcion[] = [];
  cargando = false;
  terminoBusqueda = '';
  filtroEstado = '';

  constructor(private inscripcionService: InscripcionService) {}

  ngOnInit() {
    this.cargarInscripciones();
  }

  cargarInscripciones() {
    this.cargando = true;
    this.inscripcionService.getAll().subscribe({
      next: (datos) => {
        this.inscripciones = datos;
        this.inscripcionesFiltradas = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar inscripciones:', err);
        this.cargando = false;
      }
    });
  }

  filtrarInscripciones() {
    let filtradas = [...this.inscripciones];


    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      filtradas = filtradas.filter(i =>
        i.usuario.nombre.toLowerCase().includes(termino) ||
        i.evento.titulo.toLowerCase().includes(termino)
      );
    }


    if (this.filtroEstado) {
      filtradas = filtradas.filter(i => i.estado === this.filtroEstado);
    }

    this.inscripcionesFiltradas = filtradas;
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroEstado = '';
    this.inscripcionesFiltradas = this.inscripciones;
  }

  obtenerInscripcionesPorEstado(estado: string): Inscripcion[] {
    return this.inscripciones.filter(i => i.estado === estado);
  }

  actualizarEstado(inscripcion: Inscripcion) {
    if (inscripcion.id) {
      this.inscripcionService.update(inscripcion.id, inscripcion).subscribe({
        next: () => {
          this.cargarInscripciones();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar el estado de la inscripción');
        }
      });
    }
  }

  eliminarInscripcion(id: number) {
    if (confirm('¿Está seguro de eliminar esta inscripción? Esta acción no se puede deshacer.')) {
      this.inscripcionService.delete(id).subscribe({
        next: () => {
          this.cargarInscripciones();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la inscripción');
        }
      });
    }
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

  obtenerTiempoTranscurrido(fecha?: string | Date): string {
    if (!fecha) return 'Fecha no disponible';

    const fechaObj = typeof fecha === 'string' ? new Date(fecha) : fecha;
    const ahora = new Date().getTime();
    const fechaInscripcion = fechaObj.getTime();
    const diferencia = ahora - fechaInscripcion;

    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Hace un momento';
  }

}
