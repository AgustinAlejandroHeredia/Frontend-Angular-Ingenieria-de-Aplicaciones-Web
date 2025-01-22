import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {

  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  // TESTED
  createPlano(planoData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/planos`, planoData);
  }

  // TESTED
  getPlanos(): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/planos`);
  }

  getPlanoById(id: String): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/planos${id}`);
  }

  updatePlano(id: String, updateData: any): Observable<any[]>{
    return this.http.patch<any[]>(`${this.apiUrl}/planos/${id}`, updateData)
  }

  // TESTED
  deletePlano(id: String): Observable<any[]>{
    return this.http.delete<any[]>(`${this.apiUrl}/planos/${id}`) // le pasa el id al endpoint una vez llamado
  }
}
