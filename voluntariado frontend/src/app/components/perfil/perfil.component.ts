import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
// 1. Importa nuestro AuthService y la interfaz Usuario
import { AuthService, Usuario } from '../../services/auth.service';

// Mantenemos tus otras interfaces locales si solo se usan aquí
interface Inscripcion {
  id: number;
  evento: any;
  estado: string;
  solicitadoEn: string;
}

interface Certificado {
  id: number;
  evento: any;
  urlPdf?: string;
  fechaEmision: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  // 2. Inyecta el AuthService
  private authService = inject(AuthService);

  private readonly API_BASE = 'http://localhost:8080';

  usuarioActual: Usuario | null = null;
  inscripciones: Inscripcion[] = [];
  certificados: Certificado[] = [];

  isLoading = true;
  error: string | null = null;
  editMode = false;
  usuarioEditado: Partial<Usuario> = {};
  tabActiva: 'resumen' | 'eventos' | 'certificados' | 'configuracion' = 'resumen';

  ngOnInit(): void {
    this.cargarDatosPerfil();
  }

  cargarDatosPerfil(): void {
    this.isLoading = true;
    this.error = null;

    // 3. OBTIENE EL USUARIO DEL SERVICIO
    const usuarioLogueado = this.authService.currentUser();

    if (usuarioLogueado) {
        // Si hay usuario, usamos sus datos
        this.usuarioActual = usuarioLogueado;
        // Y cargamos sus datos relacionados
        this.cargarInscripciones();
        this.cargarCertificados();
        this.isLoading = false;
    } else {
        // Si no hay nadie logueado, redirigimos al login
        this.router.navigate(['/login']);
    }
  }

  cargarInscripciones(): void {
    if (!this.usuarioActual) return;

    this.http.get<Inscripcion[]>(
      `${this.API_BASE}/inscripciones/usuario/${this.usuarioActual.id}`
    ).subscribe({
      next: (data) => {
        this.inscripciones = data;
      },
      error: (err) => console.error('Error al cargar inscripciones:', err)
    });
  }

  cargarCertificados(): void {
    if (!this.usuarioActual) return;

    this.http.get<Certificado[]>(`${this.API_BASE}/certificados`).subscribe({
      next: (data) => {
        // Filtrar certificados del usuario actual
        // NOTA: Ajusta esta lógica si tu backend ya filtra por usuario
        this.certificados = data.filter(
            // Asegúrate de que la comparación sea correcta según tu modelo de datos real
           cert => cert.evento?.organizador?.id === this.usuarioActual?.id
           // ¿O quizás debería ser 'cert.usuario.id === this.usuarioActual.id'? Revisalo.
        );
      },
      error: (err) => console.error('Error al cargar certificados:', err)
    });
  }

  cambiarTab(tab: 'resumen' | 'eventos' | 'certificados' | 'configuracion'): void {
    this.tabActiva = tab;
  }

  activarEdicion(): void {
    if (!this.usuarioActual) return;
    this.editMode = true;
    this.usuarioEditado = {
      nombre: this.usuarioActual.nombre,
      correo: this.usuarioActual.correo
      // telefono: this.usuarioActual.telefono // Descomenta si añadiste 'telefono' a tu interfaz Usuario
    };
  }

  cancelarEdicion(): void {
    this.editMode = false;
    this.usuarioEditado = {};
  }

  guardarCambios(): void {
    if (!this.usuarioActual) return;

    const usuarioActualizado = {
      ...this.usuarioActual,
      ...this.usuarioEditado
    };

    this.http.put<Usuario>(
      `${this.API_BASE}/usuarios/${this.usuarioActual.id}`,
      usuarioActualizado
    ).subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
        // 4. ACTUALIZA EL SERVICIO DE AUTH TAMBIÉN
        // Para que el Navbar muestre el nuevo nombre si cambió
        this.authService.currentUser.set(usuario);
        localStorage.setItem('currentUser', JSON.stringify(usuario));

        this.editMode = false;
        alert('Perfil actualizado correctamente');
      },
      error: (err) => {
        console.error('Error al actualizar:', err);
        alert('Error al actualizar el perfil');
      }
    });
  }

  descargarCertificado(certificado: Certificado): void {
    if (certificado.urlPdf) {
      window.open(certificado.urlPdf, '_blank');
    } else {
      alert('Este certificado no tiene archivo disponible');
    }
  }

 formatearFecha(fecha: string | number[] | null | undefined): string {
     if (!fecha) return 'Fecha desconocida';

     let fechaObj: Date;

     // CASO 1: Si la fecha es un array [año, mes, dia, ...]
     if (Array.isArray(fecha)) {
       // En Java, los meses a veces van de 1-12, pero en JS van de 0-11.
       // Si tu backend envía 1 para Enero, restamos 1.
       // Asumiremos que envía [año, mes, día, hora, minuto, segundo]
       fechaObj = new Date(
         fecha[0],      // Año
         fecha[1] - 1,  // Mes (restamos 1 porque en JS Enero es 0)
         fecha[2],      // Día
         fecha[3] || 0, // Hora (opcional)
         fecha[4] || 0, // Minuto (opcional)
         fecha[5] || 0  // Segundo (opcional)
       );
     }
     // CASO 2: Si la fecha es un string normal
     else {
       fechaObj = new Date(fecha);
     }

     // Verificación final
     if (isNaN(fechaObj.getTime())) {
       return 'Fecha inválida';
     }

     return fechaObj.toLocaleDateString('es-ES', {
       day: '2-digit',
       month: 'short',
       year: 'numeric'
     });
   }

  obtenerClaseEstado(estado: string): string {
    switch(estado) {
      case 'ACEPTADA': return 'estado-aceptada';
      case 'PENDIENTE': return 'estado-pendiente';
      case 'RECHAZADA': return 'estado-rechazada';
      default: return '';
    }
  }

  navegarEventos(): void {
    this.router.navigate(['/eventos']);
  }
}
