import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
  confirmPassword: string;
  telefono: string;
  aceptaTerminos: boolean;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerData: RegisterData = {
    nombre: '',
    correo: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    aceptaTerminos: false
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  showConfirmPassword = false;
  currentStep = 1;
  totalSteps = 3;

  validations = {
    nombre: { valid: false, message: '' },
    correo: { valid: false, message: '' },
    password: { valid: false, message: '' },
    confirmPassword: { valid: false, message: '' },
    telefono: { valid: false, message: '' }
  };

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
  }
getPasswordStrength(): string {
    const password = this.registerData.password;

    if (!password) {
      return '';
    }

    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[^a-zA-Z0-9]/.test(password);
    const length = password.length;

    if (length < 6) {
      return 'Muy Débil';
    } else if (length >= 8 && hasLetters && hasNumbers && hasSymbols) {
      return 'Fuerte';
    } else if (length >= 6 && (hasLetters && hasNumbers)) {
      return 'Media';
    } else {
      return 'Débil';
    }
  }

  validateNombre(): void {
    if (!this.registerData.nombre) {
      this.validations.nombre = { valid: false, message: 'El nombre es requerido' };
    } else if (this.registerData.nombre.length < 3) {
      this.validations.nombre = { valid: false, message: 'El nombre debe tener al menos 3 caracteres' };
    } else {
      this.validations.nombre = { valid: true, message: '' };
    }
  }

  validateCorreo(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.registerData.correo) {
      this.validations.correo = { valid: false, message: 'El correo es requerido' };
    } else if (!emailRegex.test(this.registerData.correo)) {
      this.validations.correo = { valid: false, message: 'Correo electrónico inválido' };
    } else {
      this.validations.correo = { valid: true, message: '' };
    }
  }

  validatePassword(): void {
    if (!this.registerData.password) {
      this.validations.password = { valid: false, message: 'La contraseña es requerida' };
    } else if (this.registerData.password.length < 6) {
      this.validations.password = { valid: false, message: 'Mínimo 6 caracteres' };
    } else {
      this.validations.password = { valid: true, message: '' };
    }
  }

  validateConfirmPassword(): void {
    if (!this.registerData.confirmPassword) {
      this.validations.confirmPassword = { valid: false, message: 'Confirma tu contraseña' };
    } else if (this.registerData.password !== this.registerData.confirmPassword) {
      this.validations.confirmPassword = { valid: false, message: 'Las contraseñas no coinciden' };
    } else {
      this.validations.confirmPassword = { valid: true, message: '' };
    }
  }

  validateTelefono(): void {
    const phoneRegex = /^[0-9]{9}$/;
    if (this.registerData.telefono && !phoneRegex.test(this.registerData.telefono)) {
      this.validations.telefono = { valid: false, message: 'Teléfono inválido (9 dígitos)' };
    } else {
      this.validations.telefono = { valid: true, message: '' };
    }
  }
  nextStep(): void {
    if (this.currentStep === 1) {
      this.validateNombre();
      this.validateCorreo();
      if (this.validations.nombre.valid && this.validations.correo.valid) {
        this.currentStep++;
      }
    } else if (this.currentStep === 2) {
      this.validatePassword();
      this.validateConfirmPassword();
      this.validateTelefono();
      if (this.validations.password.valid && this.validations.confirmPassword.valid) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onSubmit(): void {
    if (!this.registerData.aceptaTerminos) {
      this.errorMessage = 'Debes aceptar los términos y condiciones';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.http.get<any[]>(`${environment.apiUrl}/roles`).subscribe({
      next: (roles) => {
        const rolVoluntario = roles.find(r => r.nombre === 'VOLUNTARIO') || { id: 3, nombre: 'VOLUNTARIO' };

        const nuevoUsuario = {
          nombre: this.registerData.nombre,
          correo: this.registerData.correo,
          password: this.registerData.password,
          telefono: this.registerData.telefono || null,
          puntos: 0,
          horasAcumuladas: 0,
          rol: rolVoluntario
        };

        this.http.post(`${environment.apiUrl}/usuarios`, nuevoUsuario).subscribe({
          next: (response) => {
            this.successMessage = '¡Cuenta creada exitosamente!';
            this.isLoading = false;

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error) => {
            console.error('Error al registrar:', error);
            this.errorMessage = 'Error al crear la cuenta. El correo ya podría estar registrado.';
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener roles:', error);
        this.errorMessage = 'Error al procesar el registro. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/']);
  }
}
