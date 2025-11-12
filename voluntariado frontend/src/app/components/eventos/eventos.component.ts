import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

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
  categoria?: string;
  imagen?: string;
  inscritos?: number;
  puntos?: number;
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
  private readonly API_EVENTOS = 'http://localhost:8080/eventos';

  searchTerm = '';
  fechaInicio = '';
  fechaFin = '';
  lugarFilter = '';
  categoriaSeleccionada = 'todas';
  ordenarPor = 'relevancia';

  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  isLoading = true;
  error: string | null = null;
  p: number = 1; // Página actual
  itemsPerPage: number = 3; // 9 eventos por página (3x3)

  categorias = [
    { id: 'todas', nombre: 'Todas', icon: '🌟' },
    { id: 'medio-ambiente', nombre: 'Medio Ambiente', icon: '🌱' },
    { id: 'educacion', nombre: 'Educación', icon: '📚' },
    { id: 'salud', nombre: 'Salud', icon: '🏥' },
    { id: 'animales', nombre: 'Animales', icon: '🐕' },
    { id: 'adultos-mayores', nombre: 'Adultos Mayores', icon: '👵' },
    { id: 'arte-cultura', nombre: 'Arte y Cultura', icon: '🎨' },
    { id: 'construccion', nombre: 'Construcción', icon: '🏗️' },
    { id: 'otras', nombre: 'Otras', icon: '🧩' }
  ];

  imagenesCategoria: { [key: string]: string } = {
    'medio-ambiente': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
    'educacion': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    'salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    'animales': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    'adultos-mayores': 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400&h=300&fit=crop',
    'arte-cultura': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=300&fit=crop',
    'construccion': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop'
  };

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
      this.isLoading = true;
      this.error = null;

      this.http.get<Evento[]>(this.API_EVENTOS).subscribe({
        next: (eventos) => {
          this.eventos = eventos.map(evento => {

            const categoriaReal = evento.categoria ? evento.categoria : 'otras';

            return {
              ...evento,

              categoria: categoriaReal,

              imagen: this.asignarImagen(evento, categoriaReal),

              inscritos: Math.floor(Math.random() * (evento.cupoMaximo * 0.8)),
              puntos: this.calcularPuntos(evento)
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



  asignarImagen(evento: Evento, categoriaReal: string): string {

      if (evento.imagenUrl && evento.imagenUrl.trim() !== '') {
        return evento.imagenUrl;
      }

      if (evento.imagen) return evento.imagen;

      return this.imagenesCategoria[categoriaReal] || this.imagenesCategoria['default'];
    }

  calcularPuntos(evento: Evento): number {
    if (evento.fechaInicio && evento.fechaFin) {
      const inicio = new Date(evento.fechaInicio);
      const fin = new Date(evento.fechaFin);
      const horas = Math.abs(fin.getTime() - inicio.getTime()) / 36e5;
      return Math.round(horas * 10);
    }
    return 50;
  }

  aplicarFiltros(): void {
    this.eventosFiltrados = this.eventos.filter(evento => {
      const matchSearch = !this.searchTerm ||
        evento.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchCategoria = this.categoriaSeleccionada === 'todas' ||
        evento.categoria === this.categoriaSeleccionada;

      const matchLugar = !this.lugarFilter ||
        evento.lugar.toLowerCase().includes(this.lugarFilter.toLowerCase());

      const matchFechaInicio = !this.fechaInicio ||
        new Date(evento.fechaInicio) >= new Date(this.fechaInicio);

      const matchFechaFin = !this.fechaFin ||
        new Date(evento.fechaInicio) <= new Date(this.fechaFin);

      return matchSearch && matchCategoria && matchLugar && matchFechaInicio && matchFechaFin;
    });

    // IMPORTANTE: Resetear la página a 1 cuando se aplican filtros
    this.p = 1;
    this.aplicarOrden();
  }

  aplicarOrden(): void {
    switch (this.ordenarPor) {
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
        this.eventosFiltrados.sort((a, b) => (b.puntos || 0) - (a.puntos || 0));
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
    this.categoriaSeleccionada = 'todas';
    this.ordenarPor = 'relevancia';
    this.p = 1; // Resetear a página 1
    this.aplicarFiltros();
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.aplicarFiltros();
  }

  formatearFecha(fecha: string): string {
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

  inscribirseEvento(eventoId: number): void {
    console.log('Inscribirse al evento:', eventoId);
    alert('Funcionalidad de inscripción próximamente');
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
  obtenerNombreCategoria(id: string | undefined): string {
    if (!id) return 'Otras'; // Fallback
    const categoria = this.categorias.find(c => c.id === id);
    return categoria ? categoria.nombre : 'Otras';
  }
}
