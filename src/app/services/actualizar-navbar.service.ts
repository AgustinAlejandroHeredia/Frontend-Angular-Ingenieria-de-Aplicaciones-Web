import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizacionService } from '../organizacion/organizacion.service';
import { apiUrl } from '../../environments/environment';
import { NgModel } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ActualizarNavbarService {

  constructor(private http: HttpClient, private OrganizacionService: OrganizacionService) { }

  actualizarStorage(idOrganizacion: string, nombre: string){
    const organizacion = {
      idOrganizacion: idOrganizacion,
      nombre: nombre,
    }
    localStorage.setItem('organizacion', JSON.stringify(organizacion))
  }

  // recibe el id, lo compara con el que tiene en local storage
  validarNavbar(idOrganizacion: string){
    const res = localStorage.getItem('organizacion');

    if(res){
      const contenido = JSON.parse(res)
      if(contenido.idOrganizacion === idOrganizacion){
        // la organizacion no cambio por el momento
        // fuerza el valor para el navbar igualmente
        this.OrganizacionService.setOrganizacionNombre(contenido.nombre)
        console.log('Navbar -> OK')
      }else{
        // La organizacion cambio, hay que cambiar el nombre para el navbar
        this.http.get<string>(`${apiUrl}/organizaciones/nombre/${idOrganizacion}`).subscribe(nombre_nuevo => {
          // fuerza el valor para el navbar
          console.log('RESULTADO DE BACKEND -> ', nombre_nuevo)
          if(nombre_nuevo){
            this.OrganizacionService.setOrganizacionNombre(nombre_nuevo)
            this.actualizarStorage(idOrganizacion, nombre_nuevo)
          }else{
            this.OrganizacionService.setOrganizacionNombre('ERROR_NAVBAR_NAME')
          }
        })
      }
    }else{
      console.log('No se encontro nada en local storage')
    }
  }

}
