import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Certificado } from '../models/certificado.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CertificadoService {
  private apiUrl = `${environment.apiUrl}/certificados`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Certificado[]> {
    return this.http.get<Certificado[]>(this.apiUrl);
  }

  getById(id: number): Observable<Certificado> {
    return this.http.get<Certificado>(`${this.apiUrl}/${id}`);
  }

  create(certificado: Certificado): Observable<Certificado> {
    return this.http.post<Certificado>(this.apiUrl, certificado);
  }

  update(id: number, certificado: Certificado): Observable<Certificado> {
    return this.http.put<Certificado>(`${this.apiUrl}/${id}`, certificado);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
