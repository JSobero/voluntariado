import { Usuario } from './usuario.model';
export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  lugar: string;
  cupoMaximo: number;
  organizador: Usuario;
  creadoEn?: string;
}
