import { HttpClient, HttpEvent, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

import { Response } from 'express';
import { Form } from '@angular/forms';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanoService {
  
    constructor(private http: HttpClient) {}

    // TESTED
    createPlano(archivo: File, username: string, proyectoId: string): Observable<any>{
      console.log('EJECUTA SERVICE')
      const formData: FormData = new FormData()
      formData.append('archivo', archivo, archivo.name)
      formData.append('username', username)
      formData.append('proyectoId', proyectoId)

      return this.http.post<any>(`${apiUrl}/planos/upload`, formData)
    }

    // TESTED
    getPlanos(): Observable<any[]>{
      return this.http.get<any[]>(`${apiUrl}/planos`);
    }

    getPlanoById(id: String): Observable<any[]>{
      return this.http.get<any[]>(`${apiUrl}/planos/${id}`);
    }

    updatePlano(id: String, updateData: any, archivo: any): Observable<any[]>{
      return this.http.patch<any[]>(`${apiUrl}/planos/${id}`, updateData)
    }

    // TESTED
    deletePlano(id: String): Observable<any[]>{
      return this.http.delete<any[]>(`${apiUrl}/planos/${id}`) // le pasa el id al endpoint una vez llamado
    }

    // TESTED
    downloadPlano(plano_nombre: string, id_plano_backblaze: string, ){
      console.log('downloadPlano (service) -> ', id_plano_backblaze)
      const url = `${apiUrl}/planos/download/${id_plano_backblaze}`;
      this.http.get(url, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          // Crear un enlace para la descarga
          const link = document.createElement('a');
          const objectUrl = window.URL.createObjectURL(blob);

          link.href = objectUrl;
          link.download = plano_nombre;
          link.click();

          // importante, liberar memoria
          window.URL.revokeObjectURL(objectUrl);
        },
        error: (error) => {
          console.error('Error al descargar el archivo:', error);
          alert('Error al descargar el archivo');
        },
      });
    }

    // TESTED
    verPlano(id: string): Observable<Blob>{
      return this.http.get(`${apiUrl}/planos/view/${id}`, {
        responseType: 'blob',  // Indicamos que esperamos un archivo binario
      });
    }

    // TESTED
    generarNombreRecorte(nombreOriginal: string): string {
      const timestamp = Date.now()
      const extensionIndex = nombreOriginal.lastIndexOf('.')
      const extension = nombreOriginal.slice(extensionIndex).toLocaleLowerCase()
      const nombreSinExtension = nombreOriginal.slice(0, extensionIndex)
    
      const nuevoNombre = `${nombreSinExtension}_${timestamp}_recorte${extension}`

      return nuevoNombre;
    }

    // TESTED
    createRecorte(archivo: File, username: string, user_id: string, plano_original_id: string, especialidad: string, etiquetas: string): Observable<any>{ 
      const data = {
        filename: archivo.name,
        fecha_creacion: String(Date.now()),
        subido_por: username,
        user_id: user_id,
        size: String(archivo.size),
        type: archivo.type,
        especialidad: especialidad,
        etiquetas: etiquetas,
        id_plano_original_mongo: plano_original_id,
      }
      return this.http.post<any>(`${apiUrl}/recortes`, data)
    }

    convertirPdf(id_plano_backblaze: string, pagina_seleccionada: number): Observable<any>{
      const respuesta = this.http.get(`${apiUrl}/recortes/convert_pdf_to_pic/${id_plano_backblaze}/${pagina_seleccionada}`, {
        responseType: 'blob'
      })
      console.log('RESPUESTA DESDE convertirPdf() -> ', respuesta)
      return respuesta
    }
}
