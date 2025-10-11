import { Usuario } from './usuario.model';
import { Recompensa} from './recompensa.model';
export interface Canje {
  id?: number;
  usuario: Usuario;
  recompensa: Recompensa;
  fecha?: string;
  puntosUsados: number;
  estado: 'PENDIENTE' | 'ENTREGADO' | 'CANCELADO';
}
