import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recompensa } from '../models/recompensa.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecompensaService {
  private apiUrl = `${environment.apiUrl}/recompensas`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Recompensa[]> {
    return this.http.get<Recompensa[]>(this.apiUrl);
  }

  getById(id: number): Observable<Recompensa> {
    return this.http.get<Recompensa>(`${this.apiUrl}/${id}`);
  }

  create(recompensa: Recompensa): Observable<Recompensa> {
    return this.http.post<Recompensa>(this.apiUrl, recompensa);
  }

  update(id: number, recompensa: Recompensa): Observable<Recompensa> {
    return this.http.put<Recompensa>(`${this.apiUrl}/${id}`, recompensa);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
