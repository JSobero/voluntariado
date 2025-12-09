import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  password?: string;
  telefono: string;
  puntos: number;
  horasAcumuladas: number;
  creadoEn: string;
  rol: Rol;
}

export interface Rol {
  id: number;
  nombre: string;
}

export interface Evento {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  lugar: string;
  cupoMaximo: number;
  organizador: Usuario;
  creadoEn: string;
}

export interface Recompensa {
  id: number;
  nombre: string;
  descripcion: string;
  puntosNecesarios: number;
  stock: number;
}

export interface Inscripcion {
  id?: number;
  usuario: Usuario;
  evento: Evento;
  estado: EstadoInscripcion;
  solicitadoEn?: string;
}

export interface Canje {
  id?: number;
  usuario: Usuario;
  recompensa: Recompensa;
  fecha?: string;
  puntosUsados: number;
  estado: EstadoCanje;
}

export enum EstadoInscripcion {
  PENDIENTE = 'PENDIENTE',
  ACEPTADA = 'ACEPTADA',
  RECHAZADA = 'RECHAZADA'
}

export enum EstadoCanje {
  PENDIENTE = 'PENDIENTE',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_BASE = environment.apiUrl;
  private readonly API_USUARIOS = `${this.API_BASE}/usuarios`;
  private readonly API_EVENTOS = `${this.API_BASE}/eventos`;
  private readonly API_RECOMPENSAS = `${this.API_BASE}/recompensas`;
  private readonly API_INSCRIPCIONES = `${this.API_BASE}/inscripciones`;
  private readonly API_CANJES = `${this.API_BASE}/canjes`;

  usuarioActual: Usuario | null = null;
  isLoading = true;
  error: string | null = null;

  estadisticas = {
    totalEventos: 0,
    voluntariosActivos: 0,
    horasTotales: 0,
    recompensasDisponibles: 0
  };

  eventosProximos: Evento[] = [];
  recompensasDestacadas: Recompensa[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  private obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_USUARIOS).pipe(
      catchError(this.handleError)
    );
  }

  private obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.API_EVENTOS).pipe(
      catchError(this.handleError)
    );
  }

  private obtenerRecompensas(): Observable<Recompensa[]> {
    return this.http.get<Recompensa[]>(this.API_RECOMPENSAS).pipe(
      catchError(this.handleError)
    );
  }

  private crearInscripcion(inscripcion: Partial<Inscripcion>): Observable<Inscripcion> {
    return this.http.post<Inscripcion>(this.API_INSCRIPCIONES, inscripcion).pipe(
      catchError(this.handleError)
    );
  }

  private crearCanje(canje: Partial<Canje>): Observable<Canje> {
    return this.http.post<Canje>(this.API_CANJES, canje).pipe(
      catchError(this.handleError)
    );
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.error = null;

    this.obtenerUsuarios().subscribe({
      next: (usuarios) => {
        if (usuarios.length > 0) {
          this.usuarioActual = usuarios[0];
          this.cargarEventosYRecompensas();
          this.calcularEstadisticas(usuarios);
        } else {
          this.error = 'No se encontraron usuarios en el sistema';
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'Error al cargar datos del usuario';
        this.isLoading = false;
      }
    });
  }

  private cargarEventosYRecompensas(): void {
    let eventosLoaded = false;
    let recompensasLoaded = false;

    this.obtenerEventos().subscribe({
      next: (eventos) => {
        // Filtrar eventos futuros y tomar los primeros 3
        const eventosOrdenados = eventos
          .filter(evento => new Date(evento.fechaInicio) > new Date())
          .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
          .slice(0, 3);

        this.eventosProximos = eventosOrdenados;
        this.estadisticas.totalEventos = eventos.length;
        eventosLoaded = true;

        if (recompensasLoaded) this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        eventosLoaded = true;
        if (recompensasLoaded) this.isLoading = false;
      }
    });

    this.obtenerRecompensas().subscribe({
      next: (recompensas) => {
        this.recompensasDestacadas = recompensas
          .filter(r => r.stock > 0)
          .slice(0, 3);

        this.estadisticas.recompensasDisponibles = recompensas.filter(r => r.stock > 0).length;
        recompensasLoaded = true;

        if (eventosLoaded) this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar recompensas:', error);
        recompensasLoaded = true;
        if (eventosLoaded) this.isLoading = false;
      }
    });
  }

  private calcularEstadisticas(usuarios: Usuario[]): void {
    this.estadisticas.voluntariosActivos = usuarios.filter(u =>
      u.rol.nombre === 'VOLUNTARIO'
    ).length;

    this.estadisticas.horasTotales = Math.round(
      usuarios.reduce((total, u) => total + u.horasAcumuladas, 0)
    );
  }

  inscribirseEvento(eventoId: number): void {
    if (!this.usuarioActual) {
      console.error('Usuario no encontrado');
      return;
    }

    const inscripcion = {
      usuario: { id: this.usuarioActual.id } as Usuario,
      evento: { id: eventoId } as Evento,
      estado: EstadoInscripcion.PENDIENTE
    };

    this.crearInscripcion(inscripcion).subscribe({
      next: (resultado) => {
        console.log('Inscripción exitosa:', resultado);
        alert('¡Te has inscrito exitosamente al evento! 🎉');
      },
      error: (error) => {
        console.error('Error al inscribirse:', error);
        alert('Error al inscribirse al evento. Inténtalo nuevamente.');
      }
    });
  }

  canjearRecompensa(recompensaId: number): void {
    if (!this.usuarioActual) {
      console.error('Usuario no encontrado');
      return;
    }

    const recompensa = this.recompensasDestacadas.find(r => r.id === recompensaId);
    if (!recompensa) {
      console.error('Recompensa no encontrada');
      return;
    }

    if (this.usuarioActual.puntos < recompensa.puntosNecesarios) {
      alert('No tienes suficientes puntos para canjear esta recompensa.');
      return;
    }

    const canje = {
      usuario: { id: this.usuarioActual.id } as Usuario,
      recompensa: { id: recompensaId } as Recompensa,
      puntosUsados: recompensa.puntosNecesarios,
      estado: EstadoCanje.PENDIENTE
    };

    this.crearCanje(canje).subscribe({
      next: (resultado) => {
        console.log('Canje exitoso:', resultado);
        alert('¡Has canjeado la recompensa exitosamente! 🎁');

        this.usuarioActual!.puntos -= recompensa.puntosNecesarios;

        recompensa.stock -= 1;
      },
      error: (error) => {
        console.error('Error al canjear:', error);
        alert('Error al canjear la recompensa. Inténtalo nuevamente.');
      }
    });
  }

  verTodosEventos(): void {
    this.router.navigate(['/eventos']);
  }

  verTodasRecompensas(): void {
    this.router.navigate(['/recompensas']);
  }

  verPerfil(): void {
    this.router.navigate(['/perfil']);
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private handleError = (error: any) => {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  };
}
