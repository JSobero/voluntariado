import { Usuario } from './usuario.model';
import { Evento } from './evento.model';
export interface Asistencia {
  id?: number;
  usuario: Usuario;
  evento: Evento;
  estado: 'CONFIRMADA' | 'NO_ASISTIO';
  puntosOtorgados: number;
  confirmadoEn?: string;
}
