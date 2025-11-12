import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecompensaService } from '../../core/services/recompensa.service';
import { Recompensa } from '../../core/models/recompensa.model';

@Component({
  selector: 'app-recompensas-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recompensas-list.component.html',
  styleUrls: ['./recompensas-list.component.css']
})
export class RecompensasListComponent implements OnInit {
  // --- PROPIEDADES ---
  recompensas: Recompensa[] = [];
  recompensasFiltradas: Recompensa[] = [];
  mostrarModal = false;
  modoEdicion = false;
  cargando = false;
  terminoBusqueda = '';
  recompensaActual: Recompensa = this.obtenerRecompensaVacia();

  constructor(private recompensaServicio: RecompensaService) {}

  ngOnInit() {
    this.cargarRecompensas();
  }

  // --- MÉTODOS PARA CARGAR Y FILTRAR DATOS ---
  cargarRecompensas() {
    this.cargando = true;
    this.recompensaServicio.getAll().subscribe({
      next: (data) => {
        this.recompensas = data;
        this.recompensasFiltradas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  filtrarRecompensas() {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (!termino) {
      this.recompensasFiltradas = this.recompensas;
      return;
    }
    this.recompensasFiltradas = this.recompensas.filter(r =>
      r.nombre.toLowerCase().includes(termino) ||
      r.descripcion.toLowerCase().includes(termino)
    );
  }

  // --- MÉTODOS PARA GESTIONAR EL MODAL ---
  abrirModal(recompensa?: Recompensa) {
    this.mostrarModal = true;
    if (recompensa) {
      this.modoEdicion = true;
      this.recompensaActual = { ...recompensa };
    } else {
      this.modoEdicion = false;
      this.recompensaActual = this.obtenerRecompensaVacia();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.recompensaActual = this.obtenerRecompensaVacia();
  }

  // --- MÉTODOS CRUD (Crear, Actualizar, Eliminar) ---
  guardarRecompensa() {
    if (!this.recompensaActual.nombre || !this.recompensaActual.puntosNecesarios) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (this.modoEdicion && this.recompensaActual.id) {
      this.recompensaServicio.update(this.recompensaActual.id, this.recompensaActual).subscribe({
        next: () => {
          this.cargarRecompensas();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar la recompensa');
        }
      });
    } else {
      this.recompensaServicio.create(this.recompensaActual).subscribe({
        next: () => {
          this.cargarRecompensas();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear la recompensa');
        }
      });
    }
  }

  eliminarRecompensa(id: number) {
    if (confirm('¿Estás seguro de eliminar esta recompensa? Esta acción no se puede deshacer.')) {
      this.recompensaServicio.delete(id).subscribe({
        next: () => {
          this.cargarRecompensas();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la recompensa');
        }
      });
    }
  }

  // --- MÉTODOS AUXILIARES ---
  obtenerClaseStock(stock: number): string {
    if (stock === 0) return 'stock-agotado';
    if (stock < 10) return 'stock-bajo';
    return 'stock-ok';
  }

  obtenerTextoStock(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock < 10) return 'Stock bajo';
    return 'Disponible';
  }

  obtenerRecompensaVacia(): Recompensa {
    return {
      nombre: '',
      descripcion: '',
      puntosNecesarios: 0,
      stock: 0
    };
  }
}
