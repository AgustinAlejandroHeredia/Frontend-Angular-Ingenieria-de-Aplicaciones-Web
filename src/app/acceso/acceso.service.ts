import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  constructor(private http: HttpClient) { }

  validarToken(token: string, userId: string, userNombre: string){
    return this.http.get<any>(`${apiUrl}/organizacion-access-token/validar/${token}/${userId}/${userNombre}`)
  }

  getOrganizaciones(userId: string){
    return this.http.get<any[]>(`${apiUrl}/organizaciones/view/${userId}`);
  }

}
