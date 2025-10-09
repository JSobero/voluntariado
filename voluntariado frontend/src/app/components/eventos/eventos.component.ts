import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  cupoMaximo: number;
  organizador: any;
  categoria?: string;
  imagen?: string;
  inscritos?: number;
  puntos?: number;
}

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_EVENTOS = 'http://localhost:8080/eventos';

  // Filtros
  searchTerm = '';
  fechaInicio = '';
  fechaFin = '';
  lugarFilter = '';
  categoriaSeleccionada = 'todas';
  ordenarPor = 'relevancia';

  // Datos
  eventos: Evento[] = [];
  eventosFiltrados: Evento[] = [];
  isLoading = true;
  error: string | null = null;

  // Categorías disponibles (simplificadas - sin el horrible diseño de bloques)
  categorias = [
    { id: 'todas', nombre: 'Todas', icon: '🌟' },
    { id: 'medio-ambiente', nombre: 'Medio Ambiente', icon: '🌱' },
    { id: 'educacion', nombre: 'Educación', icon: '📚' },
    { id: 'salud', nombre: 'Salud', icon: '🏥' },
    { id: 'animales', nombre: 'Animales', icon: '🐕' },
    { id: 'adultos-mayores', nombre: 'Adultos Mayores', icon: '👵' },
    { id: 'arte-cultura', nombre: 'Arte y Cultura', icon: '🎨' },
    { id: 'construccion', nombre: 'Construcción', icon: '🏗️' }
  ];

  // Imágenes por defecto según categoría
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
        // Enriquecer eventos con datos adicionales
        this.eventos = eventos.map(evento => ({
          ...evento,
          categoria: this.asignarCategoria(evento.titulo, evento.descripcion),
          imagen: this.asignarImagen(evento),
          inscritos: Math.floor(Math.random() * (evento.cupoMaximo * 0.8)),
          puntos: this.calcularPuntos(evento)
        }));

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

  asignarCategoria(titulo: string, descripcion: string): string {
    const texto = (titulo + ' ' + descripcion).toLowerCase();

    if (texto.includes('playa') || texto.includes('limpieza') || texto.includes('reforest') || texto.includes('ambient')) {
      return 'medio-ambiente';
    } else if (texto.includes('educac') || texto.includes('taller') || texto.includes('lectura') || texto.includes('enseñ')) {
      return 'educacion';
    } else if (texto.includes('salud') || texto.includes('médic') || texto.includes('hospital')) {
      return 'salud';
    } else if (texto.includes('animal') || texto.includes('mascota') || texto.includes('perro') || texto.includes('gato')) {
      return 'animales';
    } else if (texto.includes('adulto') || texto.includes('anciano') || texto.includes('mayor')) {
      return 'adultos-mayores';
    } else if (texto.includes('arte') || texto.includes('cultura') || texto.includes('música') || texto.includes('pintura')) {
      return 'arte-cultura';
    } else if (texto.includes('construc') || texto.includes('obra') || texto.includes('edificar')) {
      return 'construccion';
    }

    return 'otras';
  }

  asignarImagen(evento: Evento): string {
    if (evento.imagen) return evento.imagen;
    const categoria = this.asignarCategoria(evento.titulo, evento.descripcion);
    return this.imagenesCategoria[categoria] || this.imagenesCategoria['default'];
  }

  calcularPuntos(evento: Evento): number {
    // Calcular puntos según duración del evento
    if (evento.fechaInicio && evento.fechaFin) {
      const inicio = new Date(evento.fechaInicio);
      const fin = new Date(evento.fechaFin);
      const horas = Math.abs(fin.getTime() - inicio.getTime()) / 36e5;
      return Math.round(horas * 10);
    }
    return 50; // Puntos por defecto
  }

  aplicarFiltros(): void {
    this.eventosFiltrados = this.eventos.filter(evento => {
      // Filtro por búsqueda de texto
      const matchSearch = !this.searchTerm ||
        evento.titulo.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtro por categoría
      const matchCategoria = this.categoriaSeleccionada === 'todas' ||
        evento.categoria === this.categoriaSeleccionada;

      // Filtro por lugar
      const matchLugar = !this.lugarFilter ||
        evento.lugar.toLowerCase().includes(this.lugarFilter.toLowerCase());

      // Filtro por fecha de inicio
      const matchFechaInicio = !this.fechaInicio ||
        new Date(evento.fechaInicio) >= new Date(this.fechaInicio);

      // Filtro por fecha de fin
      const matchFechaFin = !this.fechaFin ||
        new Date(evento.fechaInicio) <= new Date(this.fechaFin);

      return matchSearch && matchCategoria && matchLugar && matchFechaInicio && matchFechaFin;
    });

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
      default: // relevancia
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
    // Aquí implementarás la lógica de inscripción
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
}
