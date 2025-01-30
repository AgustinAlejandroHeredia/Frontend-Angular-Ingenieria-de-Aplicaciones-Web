import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

import { apiUrl } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = 'http://localhost:3000/users/roles'; // URL del backend

  constructor(private http: HttpClient, private auth: AuthService) {}

  getUserRoles(): Observable<{ roles: string[] }> {
    return new Observable<{ roles: string[] }>((observer) => {
      this.auth.idTokenClaims$.subscribe({
        next: (claims) => {
          if (claims && claims.__raw) {
            const token = claims.__raw;

            console.log('EL CONTENIDO DEL TOKEN ES: ',token)

            const headers = new HttpHeaders({
              Authorization: `Bearer ${token}`,
            });

            this.http
              .get<{ roles: string[] }>(this.apiUrl, { headers })
              .subscribe({
                next: (response) => observer.next(response),
                error: (error) => observer.error(error),
              });
          } else {
            observer.error('No token available');
          }
        },
        error: (err) => observer.error(err),
      });
    });
  }
}
