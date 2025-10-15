import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificadoService } from '../../core/services/certificado.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { EventoService } from '../../core/services/evento.service';
import { Certificado } from '../../core/models/certificado.model';
import { Usuario } from '../../core/models/usuario.model';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-certificados-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificados-list.component.html',
  styleUrls: ['./certificados-list.component.css']
})
export class CertificadosListComponent implements OnInit {
  certificados: Certificado[] = [];
  listaUsuarios: Usuario[] = []; // <--- AÑADIR
  listaEventos: Evento[] = [];   // <--- AÑADIR

  cargando = false;
  mostrarModal = false;
  modoEdicion = false;
  certificadoActual: any = this.obtenerCertificadoVacio(); // Usamos 'any' para flexibilidad en el form

  // <--- INYECTAR NUEVOS SERVICIOS
  constructor(
    private certificadoService: CertificadoService,
    private usuarioService: UsuarioService,
    private eventoService: EventoService
  ) {}

  ngOnInit() {
    this.cargarCertificados();
    this.cargarDatosParaModal(); // <--- AÑADIR
  }

  // <--- NUEVA FUNCIÓN PARA CARGAR DATOS DE LOS SELECTS
  cargarDatosParaModal() {
    this.usuarioService.getAll().subscribe(data => this.listaUsuarios = data);
    this.eventoService.getAll().subscribe(data => this.listaEventos = data);
  }

  convertirArrayAFecha(arrayFecha: any): Date {
    if (!Array.isArray(arrayFecha)) return arrayFecha;
    return new Date(arrayFecha[0], arrayFecha[1] - 1, arrayFecha[2], arrayFecha[3] || 0, arrayFecha[4] || 0, arrayFecha[5] || 0);
  }

  cargarCertificados() {
    this.cargando = true;
    this.certificadoService.getAll().subscribe({
      next: (datos) => {
        this.certificados = datos.map(certificado => {
          const eventoConvertido = {
            ...certificado.evento,
            fechaInicio: this.convertirArrayAFecha(certificado.evento.fechaInicio)
          };
          return { ...certificado, fechaEmision: this.convertirArrayAFecha(certificado.fechaEmision), evento: eventoConvertido };
        });
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar certificados:', err);
        this.cargando = false;
      }
    });
  }

  abrirModal(certificado?: Certificado) {
    this.mostrarModal = true;
    if (certificado) {
      this.modoEdicion = true;
      // Para edición, nos aseguramos de que tengamos los IDs
      this.certificadoActual = {
        ...certificado,
        usuarioId: certificado.usuario.id,
        eventoId: certificado.evento.id
      };
    } else {
      this.modoEdicion = false;
      this.certificadoActual = this.obtenerCertificadoVacio();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  // En certificados-list.component.ts

  guardarCertificado() {
    // Preparamos el objeto final para enviar al backend
    const certificadoParaGuardar = {
      id: this.certificadoActual.id,
      urlPdf: this.certificadoActual.urlPdf,
      usuario: { id: this.certificadoActual.usuarioId },
      evento: { id: this.certificadoActual.eventoId }
    };

    console.log('Enviando este objeto al backend:', certificadoParaGuardar);

    // --- VALIDACIÓN AÑADIDA ---
    if (!this.modoEdicion && (!certificadoParaGuardar.usuario.id || !certificadoParaGuardar.evento.id)) {
      alert('Por favor, selecciona un usuario y un evento antes de crear el certificado.');
      return; // Detiene la ejecución de la función si los datos faltan
    }

    if (this.modoEdicion && certificadoParaGuardar.id) {
      this.certificadoService.update(certificadoParaGuardar.id, certificadoParaGuardar as Certificado).subscribe({
        next: () => { this.cargarCertificados(); this.cerrarModal(); }
      });
    } else {
      this.certificadoService.create(certificadoParaGuardar as Certificado).subscribe({
        next: () => { this.cargarCertificados(); this.cerrarModal(); },
        error: (err) => {
          console.error("Falló la creación del certificado:", err);
          alert("Hubo un error al crear el certificado. Revisa la consola del backend para más detalles.");
        }
      });
    }
  }

  eliminarCertificado(id: number) {
    if (confirm('¿Está seguro de eliminar este certificado?')) {
      this.certificadoService.delete(id).subscribe(() => this.cargarCertificados());
    }
  }

  obtenerCertificadoVacio(): any {
    return {
      urlPdf: '',
      usuarioId: null, // Campo para el ngModel del select de usuario
      eventoId: null   // Campo para el ngModel del select de evento
    };
  }
}
