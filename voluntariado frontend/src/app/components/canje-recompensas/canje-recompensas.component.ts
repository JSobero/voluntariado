import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecompensaService } from '../../core/services/recompensa.service';
import { CanjeService } from '../../core/services/canje.service';
import { AuthService } from '../../services/auth.service';
import { Recompensa } from '../../core/models/recompensa.model';
import { Canje } from '../../core/models/canje.model';

type EstadoCanje = 'idle' | 'confirmando' | 'procesando' | 'exito' | 'error';

@Component({
  selector: 'app-canje-recompensas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canje-recompensas.component.html',
  styleUrls: ['./canje-recompensas.component.css']
})
export class CanjeRecompensasComponent implements OnInit {

  private recompensaService = inject(RecompensaService);
  private canjeService = inject(CanjeService);
  public authService = inject(AuthService);
  private router = inject(Router);

  recompensas: Recompensa[] = [];
  cargando = true;
  filtroCategoria = 'todas';

  mostrarModal = false;
  recompensaSeleccionada: Recompensa | null = null;
  estadoCanje: EstadoCanje = 'idle';
  mensajeError = '';

  recompensasFiltradas = computed(() => {
    return this.recompensas;
  });

  ngOnInit() {
    this.cargarRecompensas();
    this.verificarUsuario();
  }

  verificarUsuario() {
    if (!this.authService.currentUser()) {

      this.router.navigate(['/login']);
    }
  }

  cargarRecompensas() {
    this.cargando = true;
    this.recompensaService.getAll().subscribe({
      next: (data) => {
        this.recompensas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar recompensas', err);
        this.cargando = false;
      }
    });
  }

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

  confirmarCanje() {
    const usuario = this.authService.currentUser();
    if (!usuario || !this.recompensaSeleccionada) return;

    this.estadoCanje = 'procesando';

    const nuevoCanjeRequest: any = {
        usuario: { id: usuario.id },
        recompensa: { id: this.recompensaSeleccionada.id }
    };


    this.canjeService.create(nuevoCanjeRequest).subscribe({
      next: (canjeRealizado: Canje) => {

        this.estadoCanje = 'exito';

        const puntosUsados = canjeRealizado.puntosUsados || this.recompensaSeleccionada!.puntosNecesarios;
        const usuarioActualizado = { ...usuario, puntos: usuario.puntos - puntosUsados };

        this.authService.currentUser.set(usuarioActualizado as any);
        localStorage.setItem('currentUser', JSON.stringify(usuarioActualizado));

 
        this.cargarRecompensas();

        setTimeout(() => {
            this.cerrarModal();
        }, 2000);
      },
      error: (err) => {

        console.error('Error al canjear', err);
        this.estadoCanje = 'error';

        this.mensajeError = err.error?.message || err.message || 'Hubo un problema al procesar tu canje. Intenta de nuevo.';
      }
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.recompensaSeleccionada = null;
    this.estadoCanje = 'idle';
  }

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
