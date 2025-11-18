import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './admin/layout/admin-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('voluntariado');
 public showNavbar: boolean = true; // Inicia como verdadero

     onActivate(component: object): void {
       if (
         component instanceof AdminLayoutComponent ||
         component instanceof LoginComponent ||
         component instanceof RegisterComponent
       ) {
         this.showNavbar = false;
       } else {
         this.showNavbar = true;
       }
     }
   }
