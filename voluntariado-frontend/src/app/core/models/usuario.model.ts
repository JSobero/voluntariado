export interface Usuario {
  id?: number;
  nombre: string;
  correo: string;
  password?: string;
  telefono?: string;
  puntos: number;
  horasAcumuladas: number;
  creadoEn?: string;
  rol: Rol;
}
export interface Rol {
  id?: number;
  nombre: string;
}
