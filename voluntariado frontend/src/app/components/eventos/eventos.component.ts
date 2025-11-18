import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { Categoria } from '../../core/models/categoria.model';
import { CategoriaService } from '../../core/services/categoria.service';
import { AuthService } from '../../services/auth.service';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { Inscripcion } from '../../core/models/inscripcion.model';
interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  cupoMaximo: number;
  organizador: any;
  imagenUrl?: string;
  categoria: Categoria | null;
  imagen?: string;
  inscritos?: number;
  puntosOtorga?: number;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private inscripcionService = inject(InscripcionService);
  private categoriaService = inject(CategoriaService);
  private readonly API_EVENTOS = 'http://localhost:8080/eventos';
  searchTerm = '';
  fechaInicio = '';
  fechaFin = '';
  lugarFilter = '';
  categoriaSeleccionada: number | null = null;
  ordenarPor = 'relevancia';
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  categorias: Categoria[] = [];


  isLoading = true;
  error: string | null = null;
  p: number = 1;
  itemsPerPage: number = 9;

  mostrarModal = false;
  modalTitulo = '';
  modalMensaje = '';
  modalEsError = false;

  imagenesCategoria: { [key: string]: string } = {

    'Ambiental': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
    'Educación': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    'Salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    'Animales': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    'Otras': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop'
  };

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarEventos();
  }

  cargarCategorias(): void {
    this.categoriaService.getAll().subscribe({
      next: (datos) => {
        this.categorias = datos.filter(c =>
          c.nombre === 'Ambiental' ||
          c.nombre === 'Educación' ||
          c.nombre === 'Salud' ||
          c.nombre === 'Animales' ||
          c.nombre === 'Otras'
        );
      },
      error: (err) => {
        console.error('Error al cargar categorías:', err);
      }
    });
  }

  convertirFecha(fechaTexto: any): string {
    if (!fechaTexto) return '';
    if (Array.isArray(fechaTexto) && fechaTexto.length >= 3) {
      const [año, mes, día, hora = 0, minuto = 0] = fechaTexto;
      const fecha = new Date(año, mes - 1, día, hora, minuto);
      return fecha.toISOString();
    }
    if (typeof fechaTexto === 'string') {
      return fechaTexto;
    }
    return '';
  }

  cargarEventos(): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Evento[]>(this.API_EVENTOS).subscribe({
      next: (eventos) => {
        this.eventos = eventos.map(evento => {
          const fechaInicioISO = this.convertirFecha(evento.fechaInicio);
          const fechaFinISO = evento.fechaFin ? this.convertirFecha(evento.fechaFin) : '';
          const inscritosReales = evento.inscritos || 0;

          return {
            ...evento,
            fechaInicio: fechaInicioISO,
            fechaFin: fechaFinISO,
            imagen: this.asignarImagen(evento),
            inscritos: inscritosReales
          };
        });

        this.eventosFiltrados = [...this.eventos];
        this.aplicarOrden();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.error = 'No se pudieron cargar los eventos. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  asignarImagen(evento: Evento): string {
    if (evento.imagenUrl && evento.imagenUrl.trim() !== '') {
      return evento.imagenUrl;
    }
    if (evento.imagen) return evento.imagen;
    const nombreCategoria = evento.categoria ? evento.categoria.nombre : 'default';
    return this.imagenesCategoria[nombreCategoria] || this.imagenesCategoria['default'];
  }

  calcularPuntos(evento: Evento): number {
    if (evento.fechaInicio && evento.fechaFin) {
      const inicio = new Date(evento.fechaInicio);
      const fin = new Date(evento.fechaFin);
      if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        console.warn('Cálculo de puntos falló para evento:', evento.titulo);
        return 50;
      }
      const horas = Math.abs(fin.getTime() - inicio.getTime()) / 36e5;
      return Math.round(horas * 10);
    }
    return 50;
  }

  aplicarFiltros(): void {
    this.eventosFiltrados = this.eventos.filter(evento => {
      const matchSearch = !this.searchTerm ||
        evento.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.descripcion?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchCategoria = !this.categoriaSeleccionada ||
        (evento.categoria && evento.categoria.id === this.categoriaSeleccionada);

      const matchLugar = !this.lugarFilter ||
        evento.lugar.toLowerCase().includes(this.lugarFilter.toLowerCase());

      const matchFechaInicio = !this.fechaInicio ||
        new Date(evento.fechaInicio) >= new Date(this.fechaInicio);

      const matchFechaFin = !this.fechaFin ||
        new Date(evento.fechaInicio) <= new Date(this.fechaFin);

      return matchSearch && matchCategoria && matchLugar && matchFechaInicio && matchFechaFin;
    });

    this.p = 1;
    this.aplicarOrden();
  }

  aplicarOrden(): void {
    switch(this.ordenarPor) {
      case 'fecha-asc':
        this.eventosFiltrados.sort((a, b) =>
          new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime()
        );
        break;
      case 'fecha-desc':
        this.eventosFiltrados.sort((a, b) =>
          new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
        );
        break;
      case 'puntos':
        this.eventosFiltrados.sort((a, b) =>
          (b.puntosOtorga || 0) - (a.puntosOtorga || 0)
        );
        break;
      case 'cupos':
        this.eventosFiltrados.sort((a, b) => {
          const disponiblesA = a.cupoMaximo - (a.inscritos || 0);
          const disponiblesB = b.cupoMaximo - (b.inscritos || 0);
          return disponiblesB - disponiblesA;
        });
        break;
      default:
        break;
    }
  }

  limpiarFiltros(): void {
    this.searchTerm = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.lugarFilter = '';
    this.categoriaSeleccionada = null;
    this.ordenarPor = 'relevancia';
    this.p = 1;
    this.aplicarFiltros();
  }

  seleccionarCategoria(categoriaId: number | null): void {
    this.categoriaSeleccionada = categoriaId;
    this.aplicarFiltros();
  }

  formatearFecha(fecha: string): string {
    // ... (esta función queda igual)
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  obtenerPorcentajeInscritos(evento: Evento): number {
    if (!evento.inscritos) return 0;
    return Math.round((evento.inscritos / evento.cupoMaximo) * 100);
  }

  obtenerNombreCategoria(categoria: Categoria | null): string {
    return categoria ? categoria.nombre : 'Otras';
  }

  inscribirseEvento(eventoId: number): void {
    const usuarioActual = this.authService.currentUser();
    if (!usuarioActual) {
      this.router.navigate(['/login']);
      return;
    }
    const usuarioId = usuarioActual.id;
    this.inscripcionService.inscribir(usuarioId, eventoId).subscribe({
      next: (respuesta: Inscripcion) => {
        this.abrirModal(
          '¡Inscripción Exitosa!',
          'Tu solicitud ha sido registrada. Está pendiente de aprobación por el organizador.',
          false
        );
        this.cargarEventos();
      },
      error: (error: any) => {
        this.abrirModal(
          'Error en la Inscripción',
          'No pudimos registrar tu solicitud. Es posible que ya estés inscrito o que no haya cupo disponible.',
          true
        );
      }
    });
  }

  abrirModal(titulo: string, mensaje: string, esError: boolean): void {
    this.modalTitulo = titulo;
    this.modalMensaje = mensaje;
    this.modalEsError = esError;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
  }

  compartirEvento(evento: Evento): void {
    if (navigator.share) {
      navigator.share({
        title: evento.titulo,
        text: evento.descripcion,
        url: window.location.href
      });
    } else {
      alert('Función de compartir no disponible en este navegador');
    }
  }

  volverInicio(): void {
    this.router.navigate(['/']);
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
