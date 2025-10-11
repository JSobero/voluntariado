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

    // Cargar estadísticas
    this.usuarioService.getAll().subscribe(usuarios => {
      this.stats.usuarios = usuarios.length;
    });

    this.eventoService.getAll().subscribe(eventos => {
      this.stats.eventos = eventos.length;
      this.recentEvents = eventos.slice(0, 5);
      this.loading = false;
    });

    this.certificadoService.getAll().subscribe(certs => {
      this.stats.certificados = certs.length;
    });

    this.canjeService.getAll().subscribe(canjes => {
      this.stats.canjes = canjes.length;
    });
  }
}
