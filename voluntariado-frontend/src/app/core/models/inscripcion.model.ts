import { Usuario } from './usuario.model';
import { Evento } from './evento.model';
export interface Inscripcion {
  id?: number;
  usuario: Usuario;
  evento: Evento;
  estado: 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA'| 'CONFIRMADA' | 'NO_ASISTIO' | 'ASISTIO';
  solicitadoEn?: string;
}
