import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrearOrganizacionService {

  constructor(private http: HttpClient) { }

  crearOrganizacion(organizacionData: any, formaData: any, user: any){
    const body = {
      organizacionData,
      formaData,
      user,
    }
    return this.http.post<any>(`${apiUrl}/organizaciones`, body)
  }

}
