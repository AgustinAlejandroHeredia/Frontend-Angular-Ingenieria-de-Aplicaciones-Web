import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  
  constructor(private http: HttpClient) { }

  crearProyecto(createData: any, user: any){
    const body = {
      createData,
      user,
    }
    return this.http.post<any>(`${apiUrl}/proyectos`, body)
  }

  getProyecto(id: String): Observable<any[]>{
    return this.http.get<any[]>(`${apiUrl}/proyectos/${id}`);
  }

  // debe obtener los planos asociados a la id que se indica de proyecto
  getPlanos(id: String){
    return this.http.get<any[]>(`${apiUrl}/proyectos/planos/${id}`)
  }

  eliminarUsuario(proyectoId: string, userId: string){
    return this.http.delete(`${apiUrl}/proyectos/${proyectoId}/usuarios/${userId}`)
  }

  cargarUsuario(proyectoId: string, userId: string, nombreUsuario:string){
    return this.http.post<any>(`${apiUrl}/proyectos/cargarUser/${userId}/${nombreUsuario}/${proyectoId}`, null)
  }

  editarProyecto(idProyecto: string, updateData: any): Observable<any[]>{
    return this.http.patch<any[]>(`${apiUrl}/proyectos/${idProyecto}`, updateData)
  }

}
