import { Component, OnInit } from '@angular/core';
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
  styleUrls: ['./eventos-list.component.css']
})
export class EventosListComponent implements OnInit {
  eventos: Evento[] = [];
  filteredEventos: Evento[] = [];
  organizadores: Usuario[] = [];
  loading = false;
  searchTerm = '';

  showModal = false;
  editMode = false;
  currentEvento: Evento = this.getEmptyEvento();

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.loadEventos();
    this.loadOrganizadores();
  }

  loadEventos() {
    this.loading = true;
    this.eventoService.getAll().subscribe({
      next: (data) => {
        this.eventos = data;
        this.filteredEventos = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.loading = false;
      }
    });
  }

  loadOrganizadores() {
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.organizadores = data.filter(u =>
          u.rol.nombre === 'ADMIN' || u.rol.nombre === 'ORGANIZADOR'
        );
      },
      error: (err) => console.error('Error al cargar organizadores:', err)
    });
  }

  filterEventos() {
    if (!this.searchTerm) {
      this.filteredEventos = this.eventos;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredEventos = this.eventos.filter(e =>
      e.titulo.toLowerCase().includes(term) ||
      e.descripcion?.toLowerCase().includes(term) ||
      e.lugar.toLowerCase().includes(term)
    );
  }

  openModal(evento?: Evento) {
    this.showModal = true;
    if (evento) {
      this.editMode = true;
      this.currentEvento = {
        ...evento,
        fechaInicio: this.formatDateForInput(evento.fechaInicio),
        fechaFin: evento.fechaFin ? this.formatDateForInput(evento.fechaFin) : undefined
      };
    } else {
      this.editMode = false;
      this.currentEvento = this.getEmptyEvento();
    }
  }

  closeModal() {
    this.showModal = false;
    this.currentEvento = this.getEmptyEvento();
  }

  saveEvento() {
    // Asegurar que el organizador sea un objeto completo
    const organizadorId = (this.currentEvento.organizador as any);
    const organizadorCompleto = this.organizadores.find(o => o.id === Number(organizadorId));

    if (!organizadorCompleto) {
      alert('Por favor seleccione un organizador válido');
      return;
    }

    const eventoToSave = {
      ...this.currentEvento,
      organizador: organizadorCompleto
    };

    if (this.editMode && this.currentEvento.id) {
      this.eventoService.update(this.currentEvento.id, eventoToSave).subscribe({
        next: () => {
          this.loadEventos();
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.eventoService.create(eventoToSave).subscribe({
        next: () => {
          this.loadEventos();
          this.closeModal();
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  deleteEvento(id: number) {
    if (confirm('¿Está seguro de eliminar este evento?')) {
      this.eventoService.delete(id).subscribe({
        next: () => this.loadEventos(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  getEmptyEvento(): Evento {
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

  formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  isEventoPast(fechaInicio: string): boolean {
    return new Date(fechaInicio) < new Date();
  }

  getEventoStatusClass(fechaInicio: string): string {
    return this.isEventoPast(fechaInicio) ?
      'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800';
  }

  getEventoStatus(fechaInicio: string): string {
    return this.isEventoPast(fechaInicio) ? 'Finalizado' : 'Próximo';
  }
}
