import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecompensaService } from '../../core/services/recompensa.service';
import { CanjeService } from '../../core/services/canje.service';
import { AuthService } from '../../services/auth.service';
import { Recompensa } from '../../core/models/recompensa.model';
import { Canje } from '../../core/models/canje.model';

// Definimos estados para la UI
type EstadoCanje = 'idle' | 'confirmando' | 'procesando' | 'exito' | 'error';

@Component({
  selector: 'app-canje-recompensas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canje-recompensas.component.html',
  styleUrls: ['./canje-recompensas.component.css']
})
export class CanjeRecompensasComponent implements OnInit {
  // Inyecciones de dependencias
  private recompensaService = inject(RecompensaService);
  private canjeService = inject(CanjeService);
  public authService = inject(AuthService); // Público para usar en el template
  private router = inject(Router);

  // Estado del componente
  recompensas: Recompensa[] = [];
  cargando = true;
  filtroCategoria = 'todas';

  // Estado del modal de confirmación
  mostrarModal = false;
  recompensaSeleccionada: Recompensa | null = null;
  estadoCanje: EstadoCanje = 'idle';
  mensajeError = '';

  // Signal computado para filtrar recompensas (opcional, por ahora básico)
  recompensasFiltradas = computed(() => {
    return this.recompensas; // Aquí podrías añadir lógica de filtrado si tuvieras categorías
  });

  ngOnInit() {
    this.cargarRecompensas();
    this.verificarUsuario();
  }

  verificarUsuario() {
    if (!this.authService.currentUser()) {
      // Si no hay usuario logueado, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  cargarRecompensas() {
    this.cargando = true;
    this.recompensaService.getAll().subscribe({
      next: (data) => {
        // Solo mostramos recompensas con stock > 0 o las marcamos visualmente
        this.recompensas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar recompensas', err);
        this.cargando = false;
      }
    });
  }

  // Iniciar proceso de canje (abre el modal)
  iniciarCanje(recompensa: Recompensa) {
    const usuario = this.authService.currentUser();
    if (!usuario) return;

    if (usuario.puntos < recompensa.puntosNecesarios) {
      alert('No tienes suficientes puntos para esta recompensa.');
      return;
    }

    this.recompensaSeleccionada = recompensa;
    this.estadoCanje = 'confirmando';
    this.mostrarModal = true;
  }

  // Confirmar canje (llama al servicio)
  confirmarCanje() {
    const usuario = this.authService.currentUser();
    if (!usuario || !this.recompensaSeleccionada) return;

    this.estadoCanje = 'procesando';

    // Creamos el objeto Canje según tu modelo (ajusta si tu backend espera algo diferente)
    const nuevoCanje: any = { // Usamos 'any' temporalmente por si tu modelo Canje es estricto con IDs
        usuario: { id: usuario.id },       // Enviamos solo el ID del usuario
        recompensa: { id: this.recompensaSeleccionada.id }, // Enviamos solo el ID de la recompensa
        fechaCanje: new Date().toISOString(), // O deja que el backend ponga la fecha
        estado: 'PENDIENTE' // O el estado inicial que use tu backend
    };

    this.canjeService.create(nuevoCanje).subscribe({
      next: (canjeRealizado) => {
        this.estadoCanje = 'exito';
        // ACTUALIZAR PUNTOS DEL USUARIO EN EL FRONTEND
        // Restamos los puntos localmente para que la UI se actualice al instante
        const usuarioActualizado = { ...usuario, puntos: usuario.puntos - this.recompensaSeleccionada!.puntosNecesarios };

        // Actualizamos el Auth Service y el LocalStorage
        this.authService.currentUser.set(usuarioActualizado as any);
        localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));

        // Actualizar stock localmente también
        if (this.recompensaSeleccionada) {
            this.recompensaSeleccionada.stock--;
        }

        setTimeout(() => {
            this.cerrarModal();
        }, 2000); // Cerrar modal después de 2s de éxito
      },
      error: (err) => {
        console.error('Error al canjear', err);
        this.estadoCanje = 'error';
        this.mensajeError = 'Hubo un problema al procesar tu canje. Intenta de nuevo.';
      }
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.recompensaSeleccionada = null;
    this.estadoCanje = 'idle';
  }

  // Helpers para la UI
  calcularPorcentaje(puntosNecesarios: number): number {
    const puntosUsuario = this.authService.currentUser()?.puntos || 0;
    if (puntosUsuario >= puntosNecesarios) return 100;
    return (puntosUsuario / puntosNecesarios) * 100;
  }

  puntosFaltantes(puntosNecesarios: number): number {
    const puntosUsuario = this.authService.currentUser()?.puntos || 0;
    return Math.max(0, puntosNecesarios - puntosUsuario);
  }
}
