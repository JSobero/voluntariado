import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadoService } from '../../core/services/certificado.service';
import { Certificado } from '../../core/models/certificado.model';

@Component({
  selector: 'app-certificados-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Gestión de Certificados</h1>
            <p class="text-gray-600 mt-1">Administra los certificados emitidos</p>
          </div>
          <button (click)="openModal()"
                  class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
            ➕ Nuevo Certificado
          </button>
        </div>
      </div>

      <div *ngIf="loading" class="bg-white rounded-lg shadow p-6 text-center">
        <p class="text-gray-600">Cargando certificados...</p>
      </div>

      <div *ngIf="!loading" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Evento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Emisión</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PDF</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr *ngFor="let certificado of certificados" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm">{{ certificado.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap font-medium">
                <div>{{ certificado.usuario.nombre }}</div>
                <div class="text-xs text-gray-500">{{ certificado.usuario.correo }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="font-medium">{{ certificado.evento.titulo }}</div>
                <div class="text-xs text-gray-500">{{ certificado.evento.fechaInicio | date:'dd/MM/yyyy' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ certificado.fechaEmision | date:'dd/MM/yyyy HH:mm' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <a *ngIf="certificado.urlPdf"
                   [href]="certificado.urlPdf"
                   target="_blank"
                   class="text-blue-600 hover:text-blue-800">
                  📄 Ver PDF
                </a>
                <span *ngIf="!certificado.urlPdf" class="text-gray-400">Sin PDF</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button (click)="openModal(certificado)"
                        class="text-blue-600 hover:text-blue-800 mr-3">
                  ✏️ Editar
                </button>
                <button (click)="deleteCertificado(certificado.id!)"
                        class="text-red-600 hover:text-red-800">
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div *ngIf="certificados.length === 0" class="p-6 text-center text-gray-600">
          No hay certificados emitidos
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
          <div class="border-b px-6 py-4">
            <h2 class="text-xl font-bold">{{ editMode ? 'Editar' : 'Nuevo' }} Certificado</h2>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">URL del PDF</label>
              <input type="url"
                     [(ngModel)]="currentCertificado.urlPdf"
                     placeholder="https://ejemplo.com/certificado.pdf"
                     class="w-full px-3 py-2 border rounded-lg">
            </div>
            <p class="text-sm text-gray-600">
              * Para crear un certificado nuevo, selecciona el usuario y evento desde la lista principal
            </p>
          </div>
          <div class="border-t px-6 py-4 flex justify-end gap-3">
            <button (click)="closeModal()" class="px-4 py-2 bg-gray-200 rounded-lg">Cancelar</button>
            <button (click)="saveCertificado()" class="px-4 py-2 bg-blue-600 text-white rounded-lg">
              {{ editMode ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CertificadosListComponent implements OnInit {
  certificados: Certificado[] = [];
  loading = false;
  showModal = false;
  editMode = false;
  currentCertificado: Certificado = this.getEmpty();

  constructor(private certificadoService: CertificadoService) {}

  ngOnInit() {
    this.loadCertificados();
  }

  loadCertificados() {
    this.loading = true;
    this.certificadoService.getAll().subscribe({
      next: (data) => {
        this.certificados = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  openModal(certificado?: Certificado) {
    this.showModal = true;
    if (certificado) {
      this.editMode = true;
      this.currentCertificado = { ...certificado };
    } else {
      this.editMode = false;
      this.currentCertificado = this.getEmpty();
    }
  }

  closeModal() {
    this.showModal = false;
  }

  saveCertificado() {
    if (this.editMode && this.currentCertificado.id) {
      this.certificadoService.update(this.currentCertificado.id, this.currentCertificado).subscribe({
        next: () => {
          this.loadCertificados();
          this.closeModal();
        }
      });
    } else {
      this.certificadoService.create(this.currentCertificado).subscribe({
        next: () => {
          this.loadCertificados();
          this.closeModal();
        }
      });
    }
  }

  deleteCertificado(id: number) {
    if (confirm('¿Eliminar certificado?')) {
      this.certificadoService.delete(id).subscribe(() => this.loadCertificados());
    }
  }

  getEmpty(): Certificado {
    return {
      usuario: {} as any,
      evento: {} as any,
      urlPdf: ''
    };
  }
}
