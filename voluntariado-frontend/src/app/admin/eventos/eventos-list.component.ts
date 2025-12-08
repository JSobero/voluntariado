import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../../core/services/evento.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { ImageService } from '../../core/services/image.service';
import { CategoriaService } from '../../core/services/categoria.service'; // <-- 1. IMPORTAR
import { Evento } from '../../core/models/evento.model';
import { Usuario } from '../../core/models/usuario.model';
import { Categoria } from '../../core/models/categoria.model'; // <-- 2. IMPORTAR
import { InscripcionService } from '../../core/services/inscripcion.service';
import { AsistenciaService } from '../../core/services/asistencia.service';
import { Inscripcion } from '../../core/models/inscripcion.model';
import { AuthService } from '../../services/auth.service';

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
  categorias: Categoria[] = [];
  categoriaFiltro: number | '' = '';
  cargando = false;
  terminoBusqueda = '';
  mostrarModal = false;
  modoEdicion = false;
  eventoActual: Evento = this.obtenerEventoVacio();

  imagenSeleccionada: File | null = null;
  imagenPreview: string | null = null;
  subiendoImagen = false;
  errorImagen: string | null = null;
  mostrarModalAsistencia = false;
    inscritos: Inscripcion[] = [];
    cargandoAsistencia = false;
    eventoParaAsistencia: string = '';

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private imageService: ImageService,
    private categoriaService: CategoriaService,
    private cdRef: ChangeDetectorRef,
    private inscripcionService: InscripcionService,
    private asistenciaService: AsistenciaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarCategorias();
    this.cargarEventos();
    this.cargarOrganizadores();
    setTimeout(() => this.cdRef.detectChanges(), 150);
  }

  cargarCategorias() {

      this.categoriaService.getAllParaEventos().subscribe({
        next: (datos) => {

          this.categorias = datos;
          this.cdRef.detectChanges();
        },
        error: (err) => console.error('Error al cargar categorías:', err)
      });
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
          })

          .sort((a, b) => (b.id || 0) - (a.id || 0));


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
  esCreadorDelEvento(evento: any): boolean {
      const usuarioActual = this.authService.currentUser();

      if (!usuarioActual || !evento.organizador) {
        return false;
      }

      return evento.organizador.id === usuarioActual.id;
   }

  convertirFecha(fecha: any): string {
      if (!fecha) return '';

      // CASO 1: Si viene como arreglo [2025, 12, 3, 13, 11] (Común en Java LocalDateTime)
      if (Array.isArray(fecha)) {
        const [anio, mes, dia, hora, minuto] = fecha;
        // Nota: En Javascript los meses van de 0 a 11, por eso restamos 1 al mes
        const fechaObj = new Date(anio, mes - 1, dia, hora || 0, minuto || 0);
        return fechaObj.toISOString();
      }

      // CASO 2: Si ya es un string, intentamos convertirlo
      if (typeof fecha === 'string') {
        // A veces llega como "2025,12,3...", limpiamos si es necesario
        return new Date(fecha).toISOString();
      }

      return '';
    }

  cargarOrganizadores() {
    // ... (esta función queda igual)
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

  // --- 👇 7. LÓGICA DE FILTRADO ACTUALIZADA 👇 ---
  filtrarEventos() {
    if (!this.terminoBusqueda && !this.categoriaFiltro) {
      this.eventosFiltrados = this.eventos;
      this.cdRef.detectChanges();
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();

    this.eventosFiltrados = this.eventos.filter(e => {
      const matchTexto = !this.terminoBusqueda ||
        e.titulo.toLowerCase().includes(termino) ||
        e.descripcion?.toLowerCase().includes(termino) ||
        e.lugar.toLowerCase().includes(termino);

      // Comparamos el ID de la categoría (e.categoria.id)
      // con el ID del filtro (this.categoriaFiltro)
      const matchCategoria = !this.categoriaFiltro ||
        (e.categoria && e.categoria.id === this.categoriaFiltro);

      return matchTexto && matchCategoria;
    });
    this.cdRef.detectChanges();
  }


  onFileSelected(event: Event): void {
    // ... (esta función queda igual)
     const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
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
      this.imageService.getBase64Preview(file).then(preview => {
        this.imagenPreview = preview;
        this.cdRef.detectChanges();
      });
    }
  }

  limpiarImagen(): void {
    this.imagenSeleccionada = null;
    this.imagenPreview = null;
    this.errorImagen = null;
    this.cdRef.detectChanges();
  }
  abrirControlAsistencia(evento: Evento) {
      this.eventoParaAsistencia = evento.titulo;
      this.mostrarModalAsistencia = true;
      this.cargandoAsistencia = true;
      this.inscritos = [];

      if (evento.id) {
        this.inscripcionService.obtenerPorEvento(evento.id).subscribe({
          next: (data) => {
            // 👇👇 AQUÍ ESTÁ EL CAMBIO MÁGICO 👇👇
            // Recorremos los datos y convertimos la fecha antes de asignarla
            this.inscritos = data.map((inscripcion: any) => {
              return {
                ...inscripcion,
                // Usamos la función convertirFecha que ya tienes en este componente
                solicitadoEn: this.convertirFecha(inscripcion.solicitadoEn)
              };
            });
            // 👆👆 FIN DEL CAMBIO 👆👆

            this.cargandoAsistencia = false;
            this.cdRef.detectChanges();
          },
          error: (err) => {
            console.error('Error cargando inscritos', err);
            this.cargandoAsistencia = false;
            this.cdRef.detectChanges();
          }
        });
      }
    }
  cerrarModalAsistencia() {
    this.mostrarModalAsistencia = false;
    this.inscritos = [];
  }

  abrirModal(evento?: Evento) {
      this.mostrarModal = true;
      this.limpiarImagen();

      if (evento) {
        this.modoEdicion = true;
        // Clonamos el objeto para evitar mutaciones no deseadas
        this.eventoActual = {
          ...evento,
          fechaInicio: this.formatearFechaParaInput(evento.fechaInicio),
          fechaFin: evento.fechaFin ? this.formatearFechaParaInput(evento.fechaFin) : undefined
        };
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
      // 1. Validamos los campos de texto y fecha
      if (!this.eventoActual.titulo || !this.eventoActual.fechaInicio || !this.eventoActual.lugar) {
        alert('Por favor completa todos los campos requeridos (Título, Fecha Inicio, Lugar)');
        return;
      }

      // --- 👇 AQUÍ ESTÁ LA CORRECIÓN 👇 ---
      //
      // 2. Validamos los objetos (¡de forma segura!)
      // Esta nueva comprobación verifica si 'organizador' es null O si 'categoria' es null
      if (!this.eventoActual.organizador || !this.eventoActual.categoria) {
        alert('Por favor seleccione un Organizador y una Categoría válidos');
        return;
      }
      // --- 👆 FIN DE LA CORRECCIÓN 👆 ---


      // 3. Lógica para subir la imagen (sin cambios)
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

      // Como ya validamos todo, 'eventoParaGuardar' es simplemente el eventoActual
      const eventoParaGuardar = this.eventoActual;

      if (this.modoEdicion && eventoParaGuardar.id) {
        this.eventoService.update(eventoParaGuardar.id, eventoParaGuardar).subscribe({
          next: (eventoActualizado) => {
            const eventoConvertido = {
              ...eventoActualizado,
              fechaInicio: this.convertirFecha(eventoActualizado.fechaInicio) || '',
              fechaFin: eventoActualizado.fechaFin ? this.convertirFecha(eventoActualizado.fechaFin) : undefined
            };
            const indice = this.eventos.findIndex(e => e.id === eventoConvertido.id);
            if (indice !== -1) {
              this.eventos[indice] = eventoConvertido;
              this.filtrarEventos(); // 👈 APLICAR FILTROS
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
        // --- Lógica de Creación (CREATE) ---
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
        categoria: null,
        fechaInicio: '',
        fechaFin: undefined,
        lugar: '',
        cupoMaximo: 0,
        puntosOtorga: 0,
        organizador: null,
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

    obtenerNombreCategoria(categoria: Categoria | null): string {
      return categoria ? categoria.nombre : 'Sin categoría';
    }

    obtenerIconoCategoria(categoria: Categoria | null): string {
      if (!categoria) return '📋';
      switch(categoria.nombre) {
        case 'Ambiental': return '🌱';
        case 'Educación': return '📚';
        case 'Salud': return '🏥';
        case 'Animales': return '🐕';
        default: return '🧩';
      }
    }

    obtenerColorCategoria(categoria: Categoria | null): string {
      if (!categoria) return '#64748b';
      switch(categoria.nombre) {
        case 'Ambiental': return '#10B981';
        case 'Educación': return '#3B82F6';
        case 'Salud':       return '#EF4444';
        case 'Animales': return '#EAB308';
        default: return '#64748b';
      }
    }
    onCategoriaChange(id: string | null): void {
      if (!id) {
        this.eventoActual.categoria = null;
        return;
      }
      this.eventoActual.categoria = this.categorias.find(c => c.id === +id) || null;
    }

    onOrganizadorChange(id: string | null): void {
      if (!id) {
        this.eventoActual.organizador = null! as Usuario;
        return;
      }
      this.eventoActual.organizador = this.organizadores.find(o => o.id === +id) || null! as Usuario;
    }
  cambiarAsistencia(inscripcion: Inscripcion, event: any) {
      const marcado = event.target.checked; // true o false

      // Llamamos al backend
      this.asistenciaService.registrarAsistencia(inscripcion.id!, marcado).subscribe({
        next: (resp) => {
          console.log('Asistencia registrada:', resp);

        },
        error: (err) => {
          console.error('Error marcando asistencia:', err);
          // Si falla, revertimos el checkbox visualmente
          event.target.checked = !marcado;
          alert('Error al registrar asistencia. Intenta nuevamente.');
        }
      });
    }
  }
