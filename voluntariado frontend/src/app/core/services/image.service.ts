// voluntariado frontend/src/app/core/services/image.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ImageUploadResponse {
  url: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/images`;

  constructor(private http: HttpClient) {}

  /**
   * Sube una imagen al servidor
   * @param file Archivo de imagen a subir
   * @param folder Carpeta de destino (eventos, recompensas, usuarios)
   */
  uploadImage(file: File, folder: string = 'general'): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<ImageUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  /**
   * Elimina una imagen del servidor
   * @param imageUrl URL de la imagen a eliminar
   */
  deleteImage(imageUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete`, {
      params: { url: imageUrl }
    });
  }

  /**
   * Valida si el archivo es una imagen válida
   * @param file Archivo a validar
   */
  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Formato no válido. Solo se permiten: JPG, PNG, GIF, WEBP'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'La imagen es demasiado grande. Tamaño máximo: 5MB'
      };
    }

    return { valid: true };
  }

  /**
   * Convierte un archivo a Base64 para vista previa
   * @param file Archivo a convertir
   */
  getBase64Preview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
