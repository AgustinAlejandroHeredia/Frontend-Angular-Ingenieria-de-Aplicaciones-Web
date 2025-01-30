import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  
  constructor(private http: HttpClient) { }

  getProyecto(id: String): Observable<any[]>{
    return this.http.get<any[]>(`${apiUrl}/proyectos/${id}`);
  }

  // debe obtener los planos asociados a la id que se indica de proyecto
  getPlanos(id: String){
    return this.http.get<any[]>(`${apiUrl}/proyectos/planos/${id}`)
  }

}
