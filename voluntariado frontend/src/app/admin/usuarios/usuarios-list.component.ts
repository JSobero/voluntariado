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
  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  loading = false;
  searchTerm = '';

  showModal = false;
  editMode = false;
  currentUsuario: Usuario = this.getEmptyUsuario();

  roles = [
    { id: 1, nombre: 'ADMIN' },
    { id: 2, nombre: 'ORGANIZADOR' },
    { id: 3, nombre: 'VOLUNTARIO' }
  ];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.loading = true;
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.filteredUsuarios = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.loading = false;
      }
    });
  }

  filterUsuarios() {
    if (!this.searchTerm) {
      this.filteredUsuarios = this.usuarios;
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsuarios = this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(term) ||
      u.correo.toLowerCase().includes(term) ||
      u.telefono?.toLowerCase().includes(term)
    );
  }

  openModal(usuario?: Usuario) {
    this.showModal = true;
    if (usuario) {
      this.editMode = true;
      this.currentUsuario = { ...usuario };
    } else {
      this.editMode = false;
      this.currentUsuario = this.getEmptyUsuario();
    }
  }

  closeModal() {
    this.showModal = false;
    this.currentUsuario = this.getEmptyUsuario();
  }

  saveUsuario() {
    if (this.editMode && this.currentUsuario.id) {
      this.usuarioService.update(this.currentUsuario.id, this.currentUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.usuarioService.create(this.currentUsuario).subscribe({
        next: () => {
          this.loadUsuarios();
          this.closeModal();
        },
        error: (err) => console.error('Error al crear:', err)
      });
    }
  }

  deleteUsuario(id: number) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.usuarioService.delete(id).subscribe({
        next: () => this.loadUsuarios(),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  getEmptyUsuario(): Usuario {
    return {
      nombre: '',
      correo: '',
      password: '',
      telefono: '',
      puntos: 0,
      horasAcumuladas: 0,
      rol: { nombre: 'VOLUNTARIO' }
    };
  }

  getRolBadgeClass(rolNombre: string): string {
    switch(rolNombre) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'ORGANIZADOR': return 'bg-blue-100 text-blue-800';
      case 'VOLUNTARIO': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}
