import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from '../../core/services/asistencia.service';
import { Asistencia } from '../../core/models/asistencia.model';

@Component({
  selector: 'app-asistencias-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Gestión de Asistencias</h1>
        <p class="text-gray-600 mt-1">Registra y confirma la asistencia a eventos</p>
      </div>

      <div *ngIf="loading" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-600">Cargando asistencias...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voluntario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puntos</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confirmado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let asistencia of asistencias" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ asistencia.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium">{{ asistencia.usuario.nombre }}</td>
              <td class="px-6 py-4">{{ asistencia.evento.titulo }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select [(ngModel)]="asistencia.estado"
                        (change)="updateAsistencia(asistencia)"
                        [ngClass]="getEstadoClass(asistencia.estado)"
                        class="px-3 py-1 rounded-full text-xs font-medium">
                  <option value="CONFIRMADA">CONFIRMADA</option>
                  <option value="NO_ASISTIO">NO ASISTIÓ</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input type="number"
                       [(ngModel)]="asistencia.puntosOtorgados"
                       (change)="updateAsistencia(asistencia)"
                       class="w-20 px-2 py-1 border border-gray-300 rounded text-center">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ asistencia.confirmadoEn | date:'dd/MM/yyyy HH:mm' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button (click)="deleteAsistencia(asistencia.id!)"
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
export class AsistenciasListComponent implements OnInit {
  asistencias: Asistencia[] = [];
  loading = false;

  constructor(private asistenciaService: AsistenciaService) {}

  ngOnInit() {
    this.loadAsistencias();
  }

  loadAsistencias() {
    this.loading = true;
    this.asistenciaService.getAll().subscribe({
      next: (data) => {
        this.asistencias = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  updateAsistencia(asistencia: Asistencia) {
    if (asistencia.id) {
      this.asistenciaService.update(asistencia.id, asistencia).subscribe({
        next: () => console.log('Actualizado'),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  deleteAsistencia(id: number) {
    if (confirm('¿Eliminar asistencia?')) {
      this.asistenciaService.delete(id).subscribe({
        next: () => this.loadAsistencias(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  getEstadoClass(estado: string): string {
    return estado === 'CONFIRMADA' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}
