import { Usuario } from './usuario.model';

export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: string; // ✅ Categoría del evento (ahora requerida)
  fechaInicio: string | Date | any;
  fechaFin?: string | Date | any;
  lugar: string;
  cupoMaximo: number;
  organizador: Usuario;
  imagenUrl?: string;
  creadoEn?: string;
}

// ✅ NUEVO: Enum con las categorías disponibles
export const CATEGORIAS_EVENTO = [
  { id: 'medio-ambiente', nombre: 'Medio Ambiente', icon: '🌱', color: '#10b981' },
  { id: 'educacion', nombre: 'Educación', icon: '📚', color: '#3b82f6' },
  { id: 'salud', nombre: 'Salud', icon: '🏥', color: '#ef4444' },
  { id: 'animales', nombre: 'Animales', icon: '🐕', color: '#f59e0b' },
  { id: 'adultos-mayores', nombre: 'Adultos Mayores', icon: '👵', color: '#8b5cf6' },
  { id: 'arte-cultura', nombre: 'Arte y Cultura', icon: '🎨', color: '#ec4899' },
  { id: 'construccion', nombre: 'Construcción', icon: '🏗️', color: '#6366f1' },
  { id: 'otras', nombre: 'Otras', icon: '📋', color: '#64748b' }
] as const;
