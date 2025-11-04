import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../core/services/asistencia.service';
import { Asistencia } from '../../core/models/asistencia.model';

@Component({
  selector: 'app-asistencias-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencias-list.component.html',
  styleUrls: ['./asistencias-list.component.css']
})
export class AsistenciasListComponent implements OnInit {
  asistencias: Asistencia[] = [];
  asistenciasFiltradas: Asistencia[] = [];
  cargando = false;
  terminoBusqueda = '';
  filtroEstado = '';

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    this.cargarAsistencias();
  }

  cargarAsistencias() {
    this.cargando = true;
    this.asistenciaService.getAll().subscribe({
      next: (datos) => {
        this.asistencias = datos;
        this.asistenciasFiltradas = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar asistencias:', err);
        this.cargando = false;
      }
    });
  }

  filtrarAsistencias() {
    let filtradas = [...this.asistencias];

    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      filtradas = filtradas.filter(a =>
        a.usuario.nombre.toLowerCase().includes(termino) ||
        a.evento.titulo.toLowerCase().includes(termino)
      );
    }


    if (this.filtroEstado) {
      filtradas = filtradas.filter(a => a.estado === this.filtroEstado);
    }

    this.asistenciasFiltradas = filtradas;
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroEstado = '';
    this.asistenciasFiltradas = this.asistencias;
  }

  obtenerAsistenciasPorEstado(estado: string): Asistencia[] {
    return this.asistencias.filter(a => a.estado === estado);
  }

  calcularTotalPuntosOtorgados(): number {
    return this.asistencias
      .filter(a => a.estado === 'CONFIRMADA')
      .reduce((total, a) => total + (a.puntosOtorgados || 0), 0);
  }

  actualizarAsistencia(asistencia: Asistencia) {
    if (asistencia.id) {

      const estadoAnterior = { ...asistencia };

      this.asistenciaService.update(asistencia.id, asistencia).subscribe({
        next: () => {
          console.log('Asistencia actualizada correctamente');
        },
        error: (err) => {

          Object.assign(asistencia, estadoAnterior);
          console.error('Error al actualizar:', err);
          alert('Error al actualizar la asistencia');
        }
      });
    }
  }

  eliminarAsistencia(id: number) {
    if (confirm('¿Está seguro de eliminar esta asistencia? Esta acción no se puede deshacer.')) {
      this.asistenciaService.delete(id).subscribe({
        next: () => {

          this.asistencias = this.asistencias.filter(a => a.id !== id);
          this.asistenciasFiltradas = this.asistenciasFiltradas.filter(a => a.id !== id);
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la asistencia');
        }
      });
    }
  }

  obtenerClaseEstado(estado: string): string {
    return estado === 'CONFIRMADA' ? 'estado-confirmada' : 'estado-no-asistio';
  }

  obtenerIconoEstado(estado: string): string {
    return estado === 'CONFIRMADA' ? '✅' : '❌';
  }

  obtenerTiempoTranscurrido(fecha: Date | string | undefined): string {
    if (!fecha) return 'Sin confirmar';

    const ahora = new Date().getTime();
    const fechaConfirmacion = new Date(fecha).getTime();
    const diferencia = ahora - fechaConfirmacion;

    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Hace un momento';
  }
}
