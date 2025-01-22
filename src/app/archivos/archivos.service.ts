import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {

  private apiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  createArchivo(archivo: File, username: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('archivo', archivo, archivo.name)
    formData.append('username', username)

    return this.http.post<any>(`${this.apiUrl}/archivos/upload`, formData, {
      headers: new HttpHeaders(),
      observe: 'events',
      reportProgress: true,
    }).pipe(take(1)); // al tomar solo una
  }

}
