import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanjeService } from '../../core/services/canje.service';
import { Canje } from '../../core/models/canje.model';

@Component({
  selector: 'app-canjes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canjes-list.component.html',
  styleUrls: ['./canjes-list.component.css']
})
export class CanjesListComponent implements OnInit {
  canjes: Canje[] = [];
  canjesFiltrados: Canje[] = [];
  cargando = false;
  terminoBusqueda = '';
  filtroEstado = '';

  constructor(private canjeService: CanjeService) {}

  ngOnInit() {
    this.cargarCanjes();
  }

  // PASO 1: AÑADIR LA FUNCIÓN DE CONVERSIÓN AQUÍ
  // <--- INICIO DEL CÓDIGO AÑADIDO ---
  convertirArrayAFecha(arrayFecha: number[]): Date {
    // El constructor de Date usa: año, mes (0-11), día, hora, minuto, segundo.
    // Restamos 1 al mes porque el backend probablemente envía 1 para Enero, pero Date necesita 0.
    return new Date(
      arrayFecha[0],      // Año
      arrayFecha[1] - 1,  // Mes (ajustado)
      arrayFecha[2],      // Día
      arrayFecha[3],      // Hora
      arrayFecha[4],      // Minuto
      arrayFecha[5] || 0  // Segundo (opcional)
    );
  }
  // <--- FIN DEL CÓDIGO AÑADIDO ---

  // En canjes-list.component.ts

  cargarCanjes() {
    this.cargando = true;
    this.canjeService.getAll().subscribe({
      next: (datos) => {
        this.canjes = datos.map(canje => {
          // Obtenemos el valor de la propiedad 'fecha'
          const fechaComoArray = canje.fecha as unknown as number[]; // <--- CORREGIDO

          return {
            ...canje, // Copia todas las propiedades originales
            // Sobrescribimos la propiedad 'fecha' con la fecha ya convertida
            fecha: this.convertirArrayAFecha(fechaComoArray) as any // <--- CORREGIDO
          };
        });

        this.canjesFiltrados = this.canjes;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar canjes:', err);
        this.cargando = false;
      }
    });
  }

  filtrarCanjes() {
    let filtrados = [...this.canjes];

    // Filtrar por búsqueda
    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      filtrados = filtrados.filter(c =>
        c.usuario.nombre.toLowerCase().includes(termino) ||
        c.recompensa.nombre.toLowerCase().includes(termino)
      );
    }

    // Filtrar por estado
    if (this.filtroEstado) {
      filtrados = filtrados.filter(c => c.estado === this.filtroEstado);
    }

    this.canjesFiltrados = filtrados;
  }

  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.filtroEstado = '';
    this.canjesFiltrados = this.canjes;
  }

  obtenerCanjesPorEstado(estado: string): Canje[] {
    return this.canjes.filter(c => c.estado === estado);
  }

  calcularTotalPuntosCanjeados(): number {
    return this.canjes.reduce((total, canje) => total + canje.puntosUsados, 0);
  }

  actualizarEstado(canje: Canje) {
      if (canje.id) {
        // Guardar el estado anterior por si falla
        const estadoAnterior = canje.estado;

        this.canjeService.update(canje.id, canje).subscribe({
          next: () => {
            // Éxito: el estado ya está actualizado en la vista
            console.log('Estado actualizado correctamente');
          },
          error: (err) => {
            // Si falla, revertir el cambio
            canje.estado = estadoAnterior;
            console.error('Error al actualizar:', err);
            alert('Error al actualizar el estado del canje');
          }
        });
      }
    }


  eliminarCanje(id: number) {
    if (confirm('¿Está seguro de eliminar este canje? Esta acción no se puede deshacer.')) {
      this.canjeService.delete(id).subscribe({
        next: () => {
          this.cargarCanjes();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el canje');
        }
      });
    }
  }

  obtenerClaseEstado(estado: string): string {
    switch(estado) {
      case 'PENDIENTE':
        return 'estado-pendiente';
      case 'ENTREGADO':
        return 'estado-entregado';
      case 'CANCELADO':
        return 'estado-cancelado';
      default:
        return 'estado-default';
    }
  }

  obtenerIconoEstado(estado: string): string {
    switch(estado) {
      case 'PENDIENTE':
        return '⏳';
      case 'ENTREGADO':
        return '✅';
      case 'CANCELADO':
        return '❌';
      default:
        return '❓';
    }
  }

  obtenerTiempoTranscurrido(fecha?: string | Date): string {
    if (!fecha) return 'Sin fecha'; // por si el valor llega vacío

    const fechaCanje = new Date(fecha).getTime();
    const ahora = Date.now();
    const diferencia = ahora - fechaCanje;

    const minutos = Math.floor(diferencia / 60000);
    const horas = Math.floor(diferencia / 3600000);
    const dias = Math.floor(diferencia / 86400000);

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Hace un momento';
  }

}

