import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemaService {

  // 1. Un BehaviorSubject guarda el estado actual (false = claro, true = oscuro)
  private isDark = new BehaviorSubject<boolean>(false);

  // 2. Un Observable para que los componentes se suscriban
  isDark$ = this.isDark.asObservable();

  constructor() {
    // 3. Al iniciar, carga la preferencia guardada
    this.cargarTemaGuardado();
  }

  private cargarTemaGuardado() {
    // Usamos 'isDarkModeAdmin' para no chocar con el tema del sitio público
    const guardado = localStorage.getItem('isDarkModeAdmin');
    const esModoOscuro = guardado === 'true';

    // Actualiza el BehaviorSubject sin volver a guardar
    this.isDark.next(esModoOscuro);
  }

  /**
   * Método público para cambiar el tema.
   * Lo llamará tu componente de configuración.
   * @param esOscuro El nuevo estado del tema
   */
  setTema(esOscuro: boolean) {
    // 1. Actualiza el estado
    this.isDark.next(esOscuro);

    // 2. Guarda la preferencia en localStorage
    localStorage.setItem('isDarkModeAdmin', esOscuro.toString());
  }
}
