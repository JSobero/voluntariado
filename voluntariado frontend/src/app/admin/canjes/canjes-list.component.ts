import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanjeService } from '../../core/services/canje.service';
import { Canje } from '../../core/models/canje.model';

@Component({
  selector: 'app-canjes-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Gestión de Canjes</h1>
        <p class="text-gray-600 mt-1">Administra los canjes de recompensas</p>
      </div>

      <div *ngIf="loading" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-600">Cargando canjes...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recompensa</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puntos Usados</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let canje of canjes" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ canje.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium">
                <div>{{ canje.usuario.nombre }}</div>
                <div class="text-xs text-gray-500">{{ canje.usuario.correo }}</div>
              </td>
              <td class="px-6 py-4">{{ canje.recompensa.nombre }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {{ canje.puntosUsados }} pts
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ canje.fecha | date:'dd/MM/yyyy HH:mm' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select [(ngModel)]="canje.estado"
                        (change)="updateEstado(canje)"
                        [ngClass]="getEstadoClass(canje.estado)"
                        class="px-3 py-1 rounded-full text-xs font-medium">
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="ENTREGADO">ENTREGADO</option>
                  <option value="CANCELADO">CANCELADO</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button (click)="deleteCanje(canje.id!)"
                        class="text-red-600 hover:text-red-800">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="canjes.length === 0" class="p-6 text-center text-gray-600">
          No hay canjes registrados
        </div>
      </div>
    </div>
  `
})
export class CanjesListComponent implements OnInit {
  canjes: Canje[] = [];
  loading = false;

  constructor(private canjeService: CanjeService) {}

  ngOnInit() {
    this.loadCanjes();
  }

  loadCanjes() {
    this.loading = true;
    this.canjeService.getAll().subscribe({
      next: (data) => {
        this.canjes = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  updateEstado(canje: Canje) {
    if (canje.id) {
      this.canjeService.update(canje.id, canje).subscribe({
        next: () => console.log('Actualizado'),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  deleteCanje(id: number) {
    if (confirm('¿Eliminar canje?')) {
      this.canjeService.delete(id).subscribe({
        next: () => this.loadCanjes(),
        error: (err) => console.error('Error:', err)
      });
    }
  }

  getEstadoClass(estado: string): string {
    switch(estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800';
      case 'ENTREGADO': return 'bg-green-100 text-green-800';
      case 'CANCELADO': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
