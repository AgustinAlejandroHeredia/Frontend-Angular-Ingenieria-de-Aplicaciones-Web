import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(private http: HttpClient) { }

  eliminarUsuarioSeleccionadoDeProyectos(idOrganizacion: string, idUsuario: string): Observable<any>{
    return this.http.delete(`${apiUrl}/organizaciones/${idOrganizacion}/${idUsuario}`)
  }

  eliminarUsuarioSeleccionadoDeOrganizacion(idOrganizacion: string, idUsuario: string): Observable<any>{
    return this.http.delete(`${apiUrl}/proyectos/${idOrganizacion}/${idUsuario}`)
  }

  enviarInvitacion(email: string, duracion: number, idOrganizacion: string){
    const data = {
      email_dest: email,
      duracion: duracion,
      idOrganizacion: idOrganizacion,
    }
    return this.http.post(`${apiUrl}/organizacion-access-token`, data)
  }

}
