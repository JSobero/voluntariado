import { Usuario } from './usuario.model';
import { Categoria } from './categoria.model';
export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  categoria: Categoria | null;
  fechaInicio: string | Date | any;
  fechaFin?: string | Date | any;
  lugar: string;
  cupoMaximo: number;
  organizador: Usuario | null;
  imagenUrl?: string;
  puntosOtorga?: number;
  creadoEn?: string;
  inscritos?: number;
}

