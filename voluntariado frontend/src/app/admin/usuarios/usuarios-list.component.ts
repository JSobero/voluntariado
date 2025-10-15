import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {
  // --- PROPIEDADES ---
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  cargando = false;
  terminoBusqueda = '';

  mostrarModal = false;
  modoEdicion = false;
  usuarioActual: Usuario = this.obtenerUsuarioVacio();

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'ORGANIZADOR' },
    { id: 3, nombre: 'VOLUNTARIO' }
  ];

  constructor(private usuarioServicio: UsuarioService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  // --- MÉTODOS PARA CARGAR Y FILTRAR DATOS ---
  cargarUsuarios() {
    this.cargando = true;
    this.usuarioServicio.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargando = false;
      }
    });
  }

  filtrarUsuarios() {
    if (!this.terminoBusqueda) {
      this.usuariosFiltrados = this.usuarios;
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase();
    this.usuariosFiltrados = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(termino) ||
      u.correo.toLowerCase().includes(termino) ||
      u.telefono?.toLowerCase().includes(termino)
    );
  }

  obtenerUsuariosPorRol(nombreRol: string): Usuario[] {
    return this.usuarios.filter(u => u.rol.nombre === nombreRol);
  }

  // --- MÉTODOS PARA GESTIONAR EL MODAL ---
  abrirModal(usuario?: Usuario) {
    this.mostrarModal = true;
    if (usuario) {
      this.modoEdicion = true;
      this.usuarioActual = { ...usuario };
    } else {
      this.modoEdicion = false;
      this.usuarioActual = this.obtenerUsuarioVacio();
    }
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.usuarioActual = this.obtenerUsuarioVacio();
  }

  // --- MÉTODOS CRUD (Crear, Actualizar, Eliminar) ---
  guardarUsuario() {
    if (!this.usuarioActual.nombre || !this.usuarioActual.correo || !this.usuarioActual.rol.nombre) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (!this.modoEdicion && !this.usuarioActual.password) {
      alert('La contraseña es requerida para crear un nuevo usuario');
      return;
    }

    if (this.modoEdicion && this.usuarioActual.id) {
      this.usuarioServicio.update(this.usuarioActual.id, this.usuarioActual).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          alert('Error al actualizar el usuario');
        }
      });
    } else {
      this.usuarioServicio.create(this.usuarioActual).subscribe({
        next: () => {
          this.cargarUsuarios();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear:', err);
          alert('Error al crear el usuario');
        }
      });
    }
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      this.usuarioServicio.delete(id).subscribe({
        next: () => {
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  // --- MÉTODOS AUXILIARES ---
  obtenerUsuarioVacio(): Usuario {
    return {
      nombre: '',
      correo: '',
      password: '',
      telefono: '',
      puntos: 0,
      horasAcumuladas: 0,
      rol: { nombre: '' }
    };
  }

  obtenerClaseInsigniaRol(nombreRol: string): string {
    switch(nombreRol) {
      case 'ADMIN':
        return 'rol-admin';
      case 'ORGANIZADOR':
        return 'rol-organizador';
      case 'VOLUNTARIO':
        return 'rol-voluntario';
      default:
        return 'rol-defecto';
    }
  }

  obtenerClaseAvatarRol(nombreRol: string): string {
    switch(nombreRol) {
      case 'ADMIN':
        return 'avatar-admin';
      case 'ORGANIZADOR':
        return 'avatar-organizador';
      case 'VOLUNTARIO':
        return 'avatar-voluntario';
      default:
        return 'avatar-defecto';
    }
  }


  obtenerIconoRol(nombreRol: string): string {
    switch(nombreRol) {
      case 'ADMIN':
        return 'bi bi-person-video3';
      case 'ORGANIZADOR':
        return 'bi bi-person-rolodex';
      case 'VOLUNTARIO':
        return 'bi bi-person-heart';
      default:
        return 'bi bi-person-fill';
    }
  }
}
