import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RecortesService {

  constructor(private http: HttpClient) { }

  getRecortes(idUser: string){
    return this.http.get<any[]>(`${apiUrl}/recortes/user/${idUser}`);
  }

}
