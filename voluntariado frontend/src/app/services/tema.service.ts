import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemaService {
  private isDark = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDark.asObservable();

  constructor() {
    this.cargarTemaGuardado();
  }

  private cargarTemaGuardado() {
    const guardado = localStorage.getItem('isDarkModeAdmin');
    const esModoOscuro = guardado === 'true';
    this.isDark.next(esModoOscuro);
  }
  setTema(esOscuro: boolean) {
    this.isDark.next(esOscuro);
    localStorage.setItem('isDarkModeAdmin', esOscuro.toString());
  }
}
