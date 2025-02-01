import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

// comunicacion entre componentes apra obtener el nombre de la organizacion a mostrar por parte del navbar
import { BehaviorSubject } from 'rxjs';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizacionService {

  private organizacionSeleccionada  = new BehaviorSubject<string>('')
  organizacionSeleccionada$ = this.organizacionSeleccionada.asObservable()

  constructor(private http: HttpClient) { }

  getOrganizacionById(organizacionId: string){
    return this.http.get<any[]>(`${apiUrl}/organizaciones/${organizacionId}`)
  }


  // proceso para comunicar el nombre
  setOrganizacionNombre(nombre: string) {
    this.organizacionSeleccionada.next(nombre);
  }

}
