import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { Inscripcion } from '../../core/models/inscripcion.model';

@Component({
  selector: 'app-inscripciones-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Gestión de Inscripciones</h1>
        <p class="text-gray-600 mt-1">Administra las inscripciones a eventos</p>
      </div>

      <div *ngIf="loading" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-600">Cargando inscripciones...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voluntario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Solicitud</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let inscripcion of inscripciones" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ inscripcion.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium">{{ inscripcion.usuario.nombre }}</td>
              <td class="px-6 py-4">{{ inscripcion.evento.titulo }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select [(ngModel)]="inscripcion.estado"
                        (change)="updateEstado(inscripcion)"
                        [ngClass]="getEstadoClass(inscripcion.estado)"
                        class="px-3 py-1 rounded-full text-xs font-medium">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="ACEPTADA">ACEPTADA</option>
                  <option value="RECHAZADA">RECHAZADA</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ inscripcion.solicitadoEn | date:'dd/MM/yyyy HH:mm' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button (click)="deleteInscripcion(inscripcion.id!)"
                        class="text-red-600 hover:text-red-800">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class InscripcionesListComponent implements OnInit {
  inscripciones: Inscripcion[] = [];
  loading = false;

  constructor(private inscripcionService: InscripcionService) {}

  ngOnInit() {
    this.loadInscripciones();
  }

  loadInscripciones() {
    this.loading = true;
    this.inscripcionService.getAll().subscribe({
      next: (data) => {
        this.inscripciones = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  updateEstado(inscripcion: Inscripcion) {
    if (inscripcion.id) {
      this.inscripcionService.update(inscripcion.id, inscripcion).subscribe({
        next: () => this.loadInscripciones(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  deleteInscripcion(id: number) {
    if (confirm('¿Eliminar inscripción?')) {
      this.inscripcionService.delete(id).subscribe({
        next: () => this.loadInscripciones(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ACEPTADA': return 'bg-green-100 text-green-800';
      case 'RECHAZADA': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
