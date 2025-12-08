import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../core/services/usuario.service';
import { EventoService } from '../../core/services/evento.service';
import { CertificadoService } from '../../core/services/certificado.service';
import { CanjeService } from '../../core/services/canje.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
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
    private canjeService: CanjeService,
    private router: Router
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
     const [anio, mes, dia, hora = 0, minuto = 0, segundo = 0] = valor;
     return new Date(anio, mes - 1, dia, hora, minuto, segundo);
   }

   if (typeof valor === 'string') {
     const fecha = new Date(valor);
     return isNaN(fecha.getTime()) ? null : fecha;
   }

   if (valor instanceof Date) {
     return isNaN(valor.getTime()) ? null : valor;
   }

   return null;
 }


 verTodosEventos(): void {
   this.router.navigate(['/admin/eventos']);
 }


}
