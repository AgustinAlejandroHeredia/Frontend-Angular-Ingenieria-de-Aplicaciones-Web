import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private apiUrl = 'http://localhost:3000'
  
  constructor(private http: HttpClient) { }

  getProyectosByUser(idUser: String): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}/proyectos/user/${idUser}`); // obtiene los planos en los que este user esta registrado
  }
}
