import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../core/services/evento.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Evento } from '../../core/models/evento.model';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-eventos-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos-list.component.html',
  styleUrls: ['./eventos-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventosListComponent implements OnInit {
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  organizadores: Usuario[] = [];
  cargando = false;
  terminoBusqueda = '';

  mostrarModal = false;
  modoEdicion = false;
  eventoActual: Evento = this.obtenerEventoVacio();

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarEventos();
    this.cargarOrganizadores();
  }

  cargarEventos() {
    this.cargando = true;
    this.eventoService.getAll().subscribe({
      next: (datos) => {
        this.eventos = datos.map(e => {
          const fechaInicio = this.convertirFecha(e.fechaInicio);
          const fechaFin = e.fechaFin ? this.convertirFecha(e.fechaFin) : undefined;
          return {
            ...e,
            fechaInicio: fechaInicio || '',
            fechaFin: fechaFin || undefined
          };
        });

        this.eventosFiltrados = this.eventos;
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.cargando = false;
        this.cdRef.detectChanges();
      }
    });
  }

  convertirFecha(fechaTexto: any): string {
    if (!fechaTexto) return '';

    if (Array.isArray(fechaTexto)) {
      const [año, mes, día, hora = 0, minuto = 0] = fechaTexto;
      const fecha = new Date(año, mes - 1, día, hora, minuto);
      // Devuelve formato compatible con <input type="datetime-local">
      return fecha.toISOString().slice(0, 16);
    }

    if (typeof fechaTexto === 'string') {
      // Si ya es un string, solo asegúrate de que tenga el formato correcto
      return new Date(fechaTexto).toISOString().slice(0, 16);
    }

    return '';
  }

  cargarOrganizadores() {
    this.usuarioService.getAll().subscribe({
      next: (datos) => {
        this.organizadores = datos.filter(u =>
          u.rol.nombre === 'ADMIN' || u.rol.nombre === 'ORGANIZADOR'
        );
        this.cdRef.detectChanges();
      },
      error: (err) => console.error('Error al cargar organizadores:', err)
    });
  }

  filtrarEventos() {
    if (!this.terminoBusqueda) {
      this.eventosFiltrados = this.eventos;
      this.cdRef.detectChanges();
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.eventosFiltrados = this.eventos.filter(e =>
      e.titulo.toLowerCase().includes(termino) ||
      e.descripcion?.toLowerCase().includes(termino) ||
      e.lugar.toLowerCase().includes(termino)
    );
    this.cdRef.detectChanges();
  }

  abrirModal(evento?: Evento) {
    this.mostrarModal = true;
    if (evento) {
      this.modoEdicion = true;
      this.eventoActual = {
        ...evento,
        fechaInicio: this.formatearFechaParaInput(evento.fechaInicio),
        fechaFin: evento.fechaFin ? this.formatearFechaParaInput(evento.fechaFin) : undefined
      };
    } else {
      this.modoEdicion = false;
      this.eventoActual = this.obtenerEventoVacio();
    }
    this.cdRef.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.eventoActual = this.obtenerEventoVacio();
    this.cdRef.detectChanges();
  }

  guardarEvento() {
    if (!this.eventoActual.titulo || !this.eventoActual.fechaInicio || !this.eventoActual.lugar) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    const idOrganizador = (this.eventoActual.organizador as any);
    const organizadorCompleto = this.organizadores.find(o => o.id === Number(idOrganizador));

    if (!organizadorCompleto) {
      alert('Por favor seleccione un organizador válido');
      return;
    }

    const eventoParaGuardar = {
      ...this.eventoActual,
      organizador: organizadorCompleto
    };

    if (this.modoEdicion && this.eventoActual.id) {
      this.eventoService.update(this.eventoActual.id, eventoParaGuardar).subscribe({
        // ===== CÓDIGO CORREGIDO Y SIMPLIFICADO =====
        next: () => {
          this.cargarEventos(); // Recarga la lista completa para asegurar consistencia
          this.cerrarModal();
        },
        // ===========================================
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar el evento');
        }
      });
    } else {
      this.eventoService.create(eventoParaGuardar).subscribe({
        next: () => {
          this.cargarEventos();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear el evento');
        }
      });
    }
  }

  eliminarEvento(id: number) {
    if (confirm('¿Está seguro de eliminar este evento? Esta acción no se puede deshacer.')) {
      this.eventoService.delete(id).subscribe({
        next: () => {
          this.eventos = this.eventos.filter(e => e.id !== id);
          this.eventosFiltrados = this.eventosFiltrados.filter(e => e.id !== id);
          this.cdRef.detectChanges();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el evento');
        }
      });
    }
  }

  obtenerEventoVacio(): Evento {
    return {
      titulo: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: undefined,
      lugar: '',
      cupoMaximo: 0,
      organizador: {} as Usuario
    };
  }

  formatearFechaParaInput(fechaTexto: string | Date): string {
    if (!fechaTexto) return '';
    const fecha = new Date(fechaTexto);
    // Valida si la fecha es correcta antes de convertirla
    if (isNaN(fecha.getTime())) return '';
    return fecha.toISOString().slice(0, 16);
  }

  esEventoPasado(fechaInicio: string | Date): boolean {
    if (!fechaInicio) return false;
    return new Date(fechaInicio) < new Date();
  }

  obtenerClaseEstadoEvento(fechaInicio: string | Date): string {
    return this.esEventoPasado(fechaInicio)
      ? 'insignia-estado-gris'
      : 'insignia-estado-verde';
  }

  obtenerEstadoEvento(fechaInicio: string | Date): string {
    return this.esEventoPasado(fechaInicio) ? 'Finalizado' : 'Próximo';
  }
}
