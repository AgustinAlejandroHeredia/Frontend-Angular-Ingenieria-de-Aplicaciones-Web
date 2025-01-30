import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccesoService {

  constructor(private http: HttpClient) { }

  validarToken(token: string){

  }

  ingresar(organizacionId: string){
    
  }

  getOrganizaciones(userId: string){
    return this.http.get<any[]>(`${apiUrl}/organizaciones/view/${userId}`);
  }

}
