import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecompensaService } from '../../core/services/recompensa.service';
import { Recompensa } from '../../core/models/recompensa.model';

@Component({
  selector: 'app-recompensas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recompensas-list.component.html',
  styleUrls: ['./recompensas-list.component.css']
})
export class RecompensasListComponent implements OnInit {
  recompensas: Recompensa[] = [];
  filteredRecompensas: Recompensa[] = [];
  showModal = false;
  editMode = false;
  loading = false;
  searchTerm = '';
  currentRecompensa: Recompensa = this.getEmpty();

  constructor(private recompensaService: RecompensaService) {}

  ngOnInit() {
    this.loadRecompensas();
  }

  loadRecompensas() {
    this.loading = true;
    this.recompensaService.getAll().subscribe({
      next: (data) => {
        this.recompensas = data;
        this.filteredRecompensas = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterRecompensas() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredRecompensas = this.recompensas;
      return;
    }
    this.filteredRecompensas = this.recompensas.filter(r =>
      r.nombre.toLowerCase().includes(term) ||
      r.descripcion.toLowerCase().includes(term)
    );
  }

  openModal(recompensa?: Recompensa) {
    this.showModal = true;
    if (recompensa) {
      this.editMode = true;
      this.currentRecompensa = { ...recompensa };
    } else {
      this.editMode = false;
      this.currentRecompensa = this.getEmpty();
    }
  }

  closeModal() {
    this.showModal = false;
    this.currentRecompensa = this.getEmpty();
  }

  saveRecompensa() {
    if (!this.currentRecompensa.nombre || !this.currentRecompensa.puntosNecesarios) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    if (this.editMode && this.currentRecompensa.id) {
      this.recompensaService.update(this.currentRecompensa.id, this.currentRecompensa).subscribe({
        next: () => {
          this.loadRecompensas();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar la recompensa');
        }
      });
    } else {
      this.recompensaService.create(this.currentRecompensa).subscribe({
        next: () => {
          this.loadRecompensas();
          this.closeModal();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear la recompensa');
        }
      });
    }
  }

  deleteRecompensa(id: number) {
    if (confirm('¿Estás seguro de eliminar esta recompensa? Esta acción no se puede deshacer.')) {
      this.recompensaService.delete(id).subscribe({
        next: () => {
          this.loadRecompensas();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar la recompensa');
        }
      });
    }
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock-out';
    if (stock < 10) return 'stock-low';
    return 'stock-ok';
  }

  getStockText(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock < 10) return 'Stock bajo';
    return 'Disponible';
  }

  getEmpty(): Recompensa {
    return {
      nombre: '',
      descripcion: '',
      puntosNecesarios: 0,
      stock: 0
    };
  }
}
