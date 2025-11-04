import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  currentSlide = 0;
  currentTestimonial = 0;
  carouselInterval: any;


  heroSlides = [
    {
      title: 'Transforma vidas con tu tiempo',
      subtitle: 'Únete a nuestra comunidad de voluntarios y genera un impacto real en tu ciudad',
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=600&fit=crop',
      cta: 'Comenzar ahora'
    },
    {
      title: 'Gana mientras ayudas',
      subtitle: 'Acumula puntos por cada hora de voluntariado y canjéalos por increíbles recompensas',
      image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&h=600&fit=crop',
      cta: 'Ver recompensas'
    },
    {
      title: 'Eventos para todos',
      subtitle: 'Encuentra oportunidades que se ajusten a tus intereses y disponibilidad',
      image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=600&fit=crop',
      cta: 'Explorar eventos'
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


  featuredEvents = [
    {
      title: 'Limpieza de Playas Costa Verde',
      date: '15 Oct 2025',
      location: 'Lima, Perú',
      image: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400&h=300&fit=crop',
      participants: 45,
      maxParticipants: 50,
      points: 50
    },
    {
      title: 'Taller de Lectura para Niños',
      date: '18 Oct 2025',
      location: 'Biblioteca Municipal',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
      participants: 12,
      maxParticipants: 20,
      points: 30
    },
    {
      title: 'Reforestación en Parque Nacional',
      date: '22 Oct 2025',
      location: 'Huaraz, Perú',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop',
      participants: 28,
      maxParticipants: 30,
      points: 100
    }
  ];


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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  // --- Métodos del Carrusel ---
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
