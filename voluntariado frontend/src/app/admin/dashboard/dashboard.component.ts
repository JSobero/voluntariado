import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../core/services/usuario.service';
import { EventoService } from '../../core/services/evento.service';
import { CertificadoService } from '../../core/services/certificado.service';
import { CanjeService } from '../../core/services/canje.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = {
    usuarios: 0,
    eventos: 0,
    certificados: 0,
    canjes: 0
  };

  recentEvents: any[] = [];
  loading = true;

  constructor(
    private usuarioService: UsuarioService,
    private eventoService: EventoService,
    private certificadoService: CertificadoService,
    private canjeService: CanjeService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;


    this.usuarioService.getAll().subscribe(usuarios => {
      this.stats.usuarios = usuarios.length;
    });

    this.eventoService.getAll().subscribe(eventos => {
       console.log('📅 Eventos recibidos desde el backend:', eventos);
       if (eventos.length > 0) {
         console.log('🧩 Estructura del primer evento:', eventos[0]);
       }



      const eventosConvertidos = eventos.map((e: any) => ({
        ...e,
        fechaInicio: this.convertirFecha(e.fechaInicio),
        fechaFin: e.fechaFin ? this.convertirFecha(e.fechaFin) : undefined
      }));

      this.stats.eventos = eventosConvertidos.length;
      this.recentEvents = eventosConvertidos.slice(0, 5);
      this.loading = false;
    });

    this.certificadoService.getAll().subscribe(certs => {
      this.stats.certificados = certs.length;
    });

    this.canjeService.getAll().subscribe(canjes => {
      this.stats.canjes = canjes.length;
    });
  }


 convertirFecha(valor: any): Date | null {
   if (!valor) return null;


   if (Array.isArray(valor) && valor.length >= 3) {
     const [anio, mes, dia, hora = 0, minuto = 0] = valor;
     const fecha = new Date(anio, mes - 1, dia, hora, minuto);
     return isNaN(fecha.getTime()) ? null : fecha;
   }


   if (typeof valor === 'string' && valor.includes(',')) {
     const partes = valor.split(',').map(n => parseInt(n, 10));
     const fecha = new Date(partes[0], partes[1] - 1, partes[2], partes[3] || 0, partes[4] || 0);
     return isNaN(fecha.getTime()) ? null : fecha;
   }


   const fecha = new Date(valor);
   return isNaN(fecha.getTime()) ? null : fecha;
 }



}
