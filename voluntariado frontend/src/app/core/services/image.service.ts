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

  uploadImage(file: File, folder: string = 'general'): Observable<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<ImageUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  deleteImage(imageUrl: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete`, {
      params: { url: imageUrl }
    });
  }

  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024;
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

  getBase64Preview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}
