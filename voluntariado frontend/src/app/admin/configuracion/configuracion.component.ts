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
    }

  guardarConfiguracion(): void {
      this.guardando = true;
      this.mensaje = '';

      setTimeout(() => {
        try {
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

      this.themeService.setTema(this.configuracion.temaOscuro);
    }

onTemaOscuroChange(activado: boolean): void {
    this.themeService.setTema(activado);
  }
}
