import { TemaService} from '../../services/tema.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
interface Configuracion {
  nombreSistema: string;
  correoNotificaciones: string;
  notificacionesEmail: boolean;
  notificacionesPush: boolean;
  puntosXHora: number;
  horasMinimasCertificado: number;
  diasAnticipacionEventos: number;
  temaOscuro: boolean;
  idiomaInterface: string;
  zonaHoraria: string;
}

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, OnDestroy {

  configuracion: Configuracion = {
    nombreSistema: 'NEXO V',
    correoNotificaciones: 'admin@voluntariado.com',
    notificacionesEmail: true,
    notificacionesPush: false,
    puntosXHora: 10,
    horasMinimasCertificado: 8,
    diasAnticipacionEventos: 7,
    temaOscuro: false,
    idiomaInterface: 'es',
    zonaHoraria: 'America/Lima'
  };

  guardando = false;
  mensaje = '';

  private themeSub!: Subscription;
  constructor(
    // ✅ AÑADIDO: Inyectamos el servicio de Tema
    private themeService: TemaService
  ) {}
  ngOnInit(): void {
    this.cargarConfiguracion();
    this.themeService.setTema(this.configuracion.temaOscuro);
    this.themeSub = this.themeService.isDark$.subscribe(isDark => {
          this.configuracion.temaOscuro = isDark;
        });
  }
ngOnDestroy(): void {
    // ✅ AÑADIDO: Limpiamos la suscripción para evitar fugas de memoria
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }

  cargarConfiguracion(): void {
      const configGuardada = localStorage.getItem('configuracionSistema');
      if (configGuardada) {
        try {
          this.configuracion = JSON.parse(configGuardada);
        } catch (error) {
          console.error('Error al cargar configuración:', error);
        }
      }
      // ⛔ ELIMINADO: Ya no aplicamos el tema aquí.
      // this.aplicarTemaOscuro(this.configuracion.temaOscuro);
    }

  guardarConfiguracion(): void {
      // ... tu lógica de guardado está perfecta ...
      this.guardando = true;
      this.mensaje = '';

      setTimeout(() => {
        try {
          // Al guardar, 'this.configuracion.temaOscuro' ya está actualizado
          // gracias al (ngModelChange) y la suscripción.
          localStorage.setItem('configuracionSistema', JSON.stringify(this.configuracion));
          this.guardando = false;
          this.mensaje = 'Configuración guardada exitosamente';

          setTimeout(() => {
            this.mensaje = '';
          }, 3000);
        } catch (error) {
          // ...
        }
      }, 1000);
    }

  cancelar(): void {
      this.cargarConfiguracion();

      // ✅ AÑADIDO: Si cancela, debemos revertir el tema "en vivo"
      // al valor que acabamos de recargar del localStorage.
      this.themeService.setTema(this.configuracion.temaOscuro);
    }

onTemaOscuroChange(activado: boolean): void {
    // 'activado' ya tiene el nuevo valor del checkbox gracias
    // al evento (ngModelChange) en tu HTML.

    // Simplemente le decimos al servicio cuál es el nuevo estado.
    this.themeService.setTema(activado);
  }
}
