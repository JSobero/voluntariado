import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface EventoBackend {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  lugar: string;
  cupoMaximo: number;
  inscritos?: number;
  puntosOtorga?: number;
  imagenUrl?: string;
  categoria: any;
  imagen?: string;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_EVENTOS = 'https://voluntariado-e7o4.onrender.com';

  currentSlide = 0;
  currentTestimonial = 0;
  carouselInterval: any;

  heroSlides = [
    {
      title: 'Transforma vidas con tu tiempo',
      subtitle: 'Únete a nuestra comunidad de voluntarios y genera un impacto real en tu ciudad',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop',
      cta: 'Comenzar ahora',
      route: '/register'
    },
    {
      title: 'Gana mientras ayudas',
      subtitle: 'Acumula puntos por cada hora de voluntariado y canjéalos por increíbles recompensas',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&h=600&fit=crop',
      cta: 'Ver recompensas',
      route: '/recompensas'
    },
    {
      title: 'Eventos para todos',
      subtitle: 'Encuentra oportunidades que se ajusten a tus intereses y disponibilidad',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=600&fit=crop',
      cta: 'Explorar eventos',
      route: '/eventos'
    }
  ];

  stats = [
    { value: '5,000+', label: 'Voluntarios activos' },
    { value: '150+', label: 'Eventos realizados' },
    { value: '25,000+', label: 'Horas de voluntariado' },
    { value: '50+', label: 'Organizaciones aliadas' }
  ];

  categories = [
    { icon: 'bi bi-tree-fill', name: 'Medio Ambiente', description: 'Limpieza de playas, reforestación y más' },
    { icon: 'bi bi-mortarboard-fill', name: 'Educación', description: 'Tutorías, talleres y capacitaciones' },
    { icon: 'bi bi-heart-pulse-fill', name: 'Salud', description: 'Campañas médicas y apoyo comunitario' },
    { icon: 'bi bi-house-heart-fill', name: 'Animales', description: 'Refugios y cuidado de mascotas' },
    { icon: 'bi bi-person-heart', name: 'Adultos Mayores', description: 'Compañía y asistencia' },
    { icon: 'bi bi-palette-fill', name: 'Arte y Cultura', description: 'Eventos culturales y talleres creativos' }
  ];

  featuredEvents: any[] = [];

  imagenesCategoria: { [key: string]: string } = {
    'Ambiental': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
    'Educación': 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    'Salud': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    'Animales': 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop',
    'Otras': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop',
    'default': 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop'
  };

  testimonials = [
    {
      name: 'María González',
      role: 'Voluntaria desde 2023',
      text: 'Ser parte de esta comunidad ha cambiado mi vida. No solo he ayudado a otros, sino que he crecido como persona.',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5
    },
    {
      name: 'Carlos Mendoza',
      role: 'Voluntario desde 2022',
      text: 'La plataforma hace que sea muy fácil encontrar eventos que me apasionan. ¡Los puntos son un plus increíble!',
      avatar: 'https://i.pravatar.cc/150?img=12',
      rating: 5
    },
    {
      name: 'Ana Torres',
      role: 'Voluntaria desde 2024',
      text: 'He conocido personas maravillosas y he contribuido a causas importantes. Totalmente recomendado.',
      avatar: 'https://i.pravatar.cc/150?img=9',
      rating: 5
    }
  ];

  ngOnInit(): void {
    this.startCarousel();
    this.cargarEventosDestacados();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }


  cargarEventosDestacados(): void {
    this.http.get<EventoBackend[]>(this.API_EVENTOS).subscribe({
      next: (datos) => {
        const ultimosEventos = datos.slice(0, 3);

        this.featuredEvents = ultimosEventos.map(evento => ({
          id: evento.id,
          title: evento.titulo,
          date: this.formatearFecha(evento.fechaInicio),
          location: evento.lugar,
          image: this.asignarImagen(evento),
          participants: evento.inscritos || 0,
          maxParticipants: evento.cupoMaximo,
          points: evento.puntosOtorga || 50
        }));
      },
      error: (err) => {
        console.error('Error cargando eventos destacados:', err);
      }
    });
  }

  asignarImagen(evento: EventoBackend): string {
    if (evento.imagenUrl && evento.imagenUrl.trim() !== '') {
      return evento.imagenUrl;
    }
    const nombreCategoria = evento.categoria ? evento.categoria.nombre : 'default';
    return this.imagenesCategoria[nombreCategoria] || this.imagenesCategoria['default'];
  }

  formatearFecha(fechaISO: any): string {
    if (!fechaISO) return '';

    if (Array.isArray(fechaISO)) {
       const [año, mes, día] = fechaISO;
       const fecha = new Date(año, mes - 1, día);
       return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
  }


  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.heroSlides.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.heroSlides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  nextTestimonial(): void {
    this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.currentTestimonial = this.currentTestimonial === 0 ? this.testimonials.length - 1 : this.currentTestimonial - 1;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  navigateByPath(path: string): void {
    if (path) {
      this.router.navigate([path]);
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToEvents(): void {
    this.router.navigate(['/eventos']);
  }
}
