import { Usuario } from './usuario.model';
import { Evento } from './evento.model';
export interface Certificado {
  id?: number;
  usuario: Usuario;
  evento: Evento;
  urlPdf?: string;
  fechaEmision?: string;
}
