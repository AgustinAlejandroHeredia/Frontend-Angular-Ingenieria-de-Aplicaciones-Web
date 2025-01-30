import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  
  constructor(private http: HttpClient) { }

  getProyectosByUser(idUser: String): Observable<any[]>{
    return this.http.get<any[]>(`${apiUrl}/proyectos/user/${idUser}`); // obtiene los planos en los que este user esta registrado
  }
}
