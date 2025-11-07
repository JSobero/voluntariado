import { Usuario } from './usuario.model';
export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string | Date | any; // Permite string, Date o cualquier otro tipo
  fechaFin?: string | Date | any;
  lugar: string;
  cupoMaximo: number;
  organizador: Usuario;
  imagenUrl?: string;
  creadoEn?: string;
}
