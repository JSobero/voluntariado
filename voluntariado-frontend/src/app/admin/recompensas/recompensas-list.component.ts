import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecompensaService } from '../../core/services/recompensa.service';
import { Recompensa } from '../../core/models/recompensa.model';
import { ImageService } from '../../core/services/image.service';

@Component({
  selector: 'app-recompensas-lista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recompensas-list.component.html',
  styleUrls: ['./recompensas-list.component.css']
})
export class RecompensasListComponent implements OnInit {

  recompensas: Recompensa[] = [];
  recompensasFiltradas: Recompensa[] = [];
  mostrarModal = false;
  modoEdicion = false;
  cargando = false;
  terminoBusqueda = '';
  recompensaActual: Recompensa = this.obtenerRecompensaVacia();

  imagenSeleccionada: File | null = null;
    imagenPreview: string | null = null;
    subiendoImagen = false;
    errorImagen: string | null = null;

  constructor(
      private recompensaServicio: RecompensaService,
      private imageService: ImageService, // ✨ Inyectamos ImageService
      private cdRef: ChangeDetectorRef    // ✨ Inyectamos ChangeDetectorRef para actualizar la vista
    ) {}

  ngOnInit() {
    this.cargarRecompensas();
  }


  cargarRecompensas() {
    this.cargando = true;
    this.recompensaServicio.getAll().subscribe({
      next: (data) => {
        this.recompensas = data;
        this.recompensasFiltradas = data;
        this.cargando = false;
        this.cdRef.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cdRef.detectChanges();
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

// ✨ NUEVO: Manejo de selección de imagen
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar la imagen usando el servicio
      const validation = this.imageService.validateImage(file);
      if (!validation.valid) {
        this.errorImagen = validation.error || 'Imagen no válida';
        this.imagenSeleccionada = null;
        this.imagenPreview = null;
        this.cdRef.detectChanges();
        return;
      }

      this.errorImagen = null;
      this.imagenSeleccionada = file;

      // Generar preview
      this.imageService.getBase64Preview(file).then(preview => {
        this.imagenPreview = preview;
        this.cdRef.detectChanges();
      });
    }
  }

  // ✨ NUEVO: Limpiar imagen seleccionada
  limpiarImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    this.errorImagen = null;
    // Si estamos editando, tal vez queramos borrar la imagen del objeto actual también
    // this.recompensaActual.imagenUrl = ''; // Opcional, depende de si quieres permitir borrar la imagen existente
    this.cdRef.detectChanges();
  }

  abrirModal(recompensa?: Recompensa) {
      this.mostrarModal = true;
      this.limpiarImagen(); // ✨ Limpiar siempre al abrir

      if (recompensa) {
        this.modoEdicion = true;
        this.recompensaActual = { ...recompensa };
        // ✨ Si ya tiene imagen, mostrarla como preview
        if (recompensa.imagenUrl) {
          this.imagenPreview = recompensa.imagenUrl;
        }
      } else {
        this.modoEdicion = false;
        this.recompensaActual = this.obtenerRecompensaVacia();
      }
      this.cdRef.detectChanges();
    }

  cerrarModal() {
    this.mostrarModal = false;
    this.recompensaActual = this.obtenerRecompensaVacia();
  }


  async guardarRecompensa() {
      if (!this.recompensaActual.nombre || !this.recompensaActual.puntosNecesarios) {
        alert('Por favor completa los campos requeridos');
        return;
      }

      // ✨ NUEVO: Subir imagen si hay una seleccionada
      if (this.imagenSeleccionada) {
        this.subiendoImagen = true;
        this.cdRef.detectChanges();

        try {
          // Subimos a la carpeta 'recompensas'
          const response = await this.imageService.uploadImage(this.imagenSeleccionada, 'recompensas').toPromise();
          if (response && response.url) {
            this.recompensaActual.imagenUrl = response.url;
          }
        } catch (error) {
          console.error('Error al subir imagen:', error);
          alert('Error al subir la imagen. La recompensa se guardará sin imagen nueva.');
        } finally {
          this.subiendoImagen = false;
          this.cdRef.detectChanges();
        }
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
        stock: 0,
        imagenUrl: '' // ✨ Inicializado
      };
    }
  }
