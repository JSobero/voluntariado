import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Canje } from '../models/canje.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CanjeService {
  private apiUrl = `${environment.apiUrl}/canjes`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Canje[]> {
    return this.http.get<Canje[]>(this.apiUrl);
  }

  getById(id: number): Observable<Canje> {
    return this.http.get<Canje>(`${this.apiUrl}/${id}`);
  }

  create(canje: Canje): Observable<Canje> {
    return this.http.post<Canje>(this.apiUrl, canje);
  }

  update(id: number, canje: Canje): Observable<Canje> {
    return this.http.put<Canje>(`${this.apiUrl}/${id}`, canje);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
