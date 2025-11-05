import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('voluntariado');
  public isAdminRoute: boolean = false;

    onActivate(component: object): void {
      // Comprueba si el componente que se cargó es una
      // instancia del AdminLayoutComponent
      if (component instanceof AdminLayoutComponent) {
        this.isAdminRoute = true;
      } else {
        this.isAdminRoute = false;
      }
    }
  }
