import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../core/services/evento.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { ImageService } from '../../core/services/image.service';
import { Evento, CATEGORIAS_EVENTO} from '../../core/models/evento.model';
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
  categoriaFiltro = '';
  categorias = CATEGORIAS_EVENTO;
  mostrarModal = false;
  modoEdicion = false;
  eventoActual: Evento = this.obtenerEventoVacio();

  // ✨ NUEVO: Variables para manejo de imágenes
  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  subiendoImagen = false;
  errorImagen: string | null = null;

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private imageService: ImageService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarEventos();
    this.cargarOrganizadores();
    setTimeout(() => this.cdRef.detectChanges(), 150);
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
      return fecha.toISOString().slice(0, 16);
    }

    if (typeof fechaTexto === 'string') {
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
    if (!this.terminoBusqueda && !this.categoriaFiltro) { // ✅ MODIFICAR
      this.eventosFiltrados = this.eventos;
      this.cdRef.detectChanges();
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.eventosFiltrados = this.eventos.filter(e => {
      // ✅ AÑADIR ESTE BLOQUE
      const matchTexto = !this.terminoBusqueda ||
        e.titulo.toLowerCase().includes(termino) ||
        e.descripcion?.toLowerCase().includes(termino) ||
        e.lugar.toLowerCase().includes(termino);

      const matchCategoria = !this.categoriaFiltro ||
        e.categoria === this.categoriaFiltro;

      return matchTexto && matchCategoria;
    });
    this.cdRef.detectChanges();
  }

  // ✨ NUEVO: Manejo de selección de imagen
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar la imagen
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
    this.cdRef.detectChanges();
  }

  abrirModal(evento?: Evento) {
    this.mostrarModal = true;
    this.limpiarImagen();

    if (evento) {
      this.modoEdicion = true;
      this.eventoActual = {
        ...evento,
        fechaInicio: this.formatearFechaParaInput(evento.fechaInicio),
        fechaFin: evento.fechaFin ? this.formatearFechaParaInput(evento.fechaFin) : undefined
      };
      // Si ya tiene imagen, mostrarla como preview
      if (evento.imagenUrl) {
        this.imagenPreview = evento.imagenUrl;
      }
    } else {
      this.modoEdicion = false;
      this.eventoActual = this.obtenerEventoVacio();
    }
    this.cdRef.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.eventoActual = this.obtenerEventoVacio();
    this.limpiarImagen();
    this.cdRef.detectChanges();
  }

  async guardarEvento() {
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

    // ✨ NUEVO: Subir imagen si hay una seleccionada
    if (this.imagenSeleccionada) {
      this.subiendoImagen = true;
      this.cdRef.detectChanges();

      try {
        const response = await this.imageService.uploadImage(this.imagenSeleccionada, 'eventos').toPromise();
        if (response && response.url) {
          this.eventoActual.imagenUrl = response.url;
        }
      } catch (error) {
        console.error('Error al subir imagen:', error);
        alert('Error al subir la imagen. El evento se guardará sin imagen.');
      } finally {
        this.subiendoImagen = false;
        this.cdRef.detectChanges();
      }
    }

    const eventoParaGuardar = {
          ...this.eventoActual,
          organizador: organizadorCompleto
        };

        if (this.modoEdicion && this.eventoActual.id) {

          // MIRA AQUÍ:
          this.eventoService.update(this.eventoActual.id, eventoParaGuardar).subscribe({

            // El problema está en este bloque 'next'
            next: (eventoActualizado) => {

              // --- INICIO DE LA CORRECCIÓN ---
              // Debemos convertir las fechas del evento que acaba de llegar,
              // igual que hicimos en cargarEventos()
              const eventoConvertido = {
                ...eventoActualizado,
                fechaInicio: this.convertirFecha(eventoActualizado.fechaInicio) || '',
                fechaFin: eventoActualizado.fechaFin ? this.convertirFecha(eventoActualizado.fechaFin) : undefined
              };
              // --- FIN DE LA CORRECCIÓN ---


              // Ahora buscamos el índice
              const indice = this.eventos.findIndex(e => e.id === eventoConvertido.id);

              if (indice !== -1) {
                // Y guardamos el evento YA CONVERTIDO
                this.eventos[indice] = eventoConvertido;
                this.eventosFiltrados = [...this.eventos];
              }
              this.cerrarModal();
              this.cdRef.detectChanges();
            },
            error: (err) => {
              console.error('Error al actualizar:', err);
              alert('Error al actualizar el evento');
            }
          });
        } else {
          // El bloque 'create' está bien porque llama a cargarEventos(),
          // que ya hace la conversión.
          this.eventoService.create(eventoParaGuardar).subscribe({
            next: () => {
              this.cargarEventos();
              this.cerrarModal();
              this.cdRef.detectChanges();
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
      categoria: 'otras',
      fechaInicio: '',
      fechaFin: undefined,
      lugar: '',
      cupoMaximo: 0,
      organizador: {} as Usuario,
      imagenUrl: ''
    };
  }

  formatearFechaParaInput(fechaTexto: string): string {
    const fecha = new Date(fechaTexto);
    return fecha.toISOString().slice(0, 16);
  }

  esEventoPasado(fechaInicio: string): boolean {
    return new Date(fechaInicio) < new Date();
  }

  obtenerClaseEstadoEvento(fechaInicio: string): string {
    return this.esEventoPasado(fechaInicio)
      ? 'insignia-estado-gris'
      : 'insignia-estado-verde';
  }

  obtenerEstadoEvento(fechaInicio: string): string {
    return this.esEventoPasado(fechaInicio) ? 'Finalizado' : 'Próximo';
  }

// ✅ AÑADIR ESTOS MÉTODOS
  obtenerNombreCategoria(categoriaId: string): string {
  const categoria = this.categorias.find(c => c.id === categoriaId);
  return categoria ? categoria.nombre : 'Sin categoría';
  }

  obtenerIconoCategoria(categoriaId: string): string {
  const categoria = this.categorias.find(c => c.id === categoriaId);
  return categoria ? categoria.icon : '📋';
  }

  obtenerColorCategoria(categoriaId: string): string {
  const categoria = this.categorias.find(c => c.id === categoriaId);
  return categoria ? categoria.color : '#64748b';
  }
}
