import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, firstValueFrom, map, Observable, switchMap, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth0: Auth0Service, private http: HttpClient) {}

  login() {
    this.auth0.loginWithRedirect();
  }

  /*
  logout() {
    this.auth0.logout({
        returnTo: window.location.origin, // La URL a la que quieres redirigir al usuario después de hacer logout
    });
  }
  */

  checkPermission(role: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.auth0.user$.subscribe((user) => {
        const roles: string[] = user?.['/roles'] || []; // Obtener los roles
        const isAdmin = roles.some((r: string) => r.toLowerCase() === role.toLowerCase()); // Comprobar si tiene el rol
        observer.next(isAdmin);
        observer.complete();
      });
    });
  }

  async isAdmin(): Promise<boolean> {
    const res = await firstValueFrom(this.checkPermission('admin'))
    console.log('Admin : ', res)
    return res
  }
  
  async isCreator(): Promise<boolean> {
    const res = await firstValueFrom(this.checkPermission('creator'))
    console.log('Creator : ', res)
    return res
  }

  /*
  getAccessToken(): Observable<any> {
    const url = `https://${environment.auth0Domain}/oauth/token`;
    const body = {
      client_id: environment.auth0ClientId,
      client_secret: environment.auth0Secret,
      audience: environment.auth0Domain,
      grant_type: 'client_credentials',
    };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, body, { headers });
  }

  getAccessTokenString(): Observable<string> {
    return new Observable((observer) => {
      this.auth0.getAccessTokenSilently().subscribe({
        next: (token) => observer.next(token), // Devuelve el token obtenido
        error: (error) => observer.error(error), // Maneja el error si falla la obtención
      });
    });
  }
  

  getUserData(userId: string, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`, // Agregamos el token en los headers
    });

    return this.http.get(`${environment.apiUrl}/${userId}`, { headers });
  }
  */

  /*
  getAccessToken(): Promise<string> {
    return this.auth0.getAccessTokenSilently().toPromise().then((token) => {
      if (!token) {
        throw new Error('Access token is undefined');
      }
      return token;
    });
  }
  */

  getAccessToken(): Observable<string> {
    return this.auth0.getAccessTokenSilently();
  }


  /*
  getUserData(userId: string) {
    return this.getAccessToken().then((token) => {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.get(`${environment.apiUrl}/users/user_data/${userId}`, { headers }).toPromise();
    });
  }
    */

  /*
  getUserData(userId: string) {
    return this.auth0.getAccessTokenSilently().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${environment.apiUrl}/users/user_data/${userId}`, { headers });
      })
    );
  }
    */

  getUserData(userId: string): Observable<any> {
    return this.auth0.getAccessTokenSilently().pipe(
      switchMap((accessToken) => {
        if (!accessToken) {
          throw new Error('No access token available');
        }
  
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${accessToken}`
        );
  
        return this.http.get(`${environment.apiUrl}/users/user_data/${userId}`, { headers }).pipe(
          catchError((error) => {
            console.error('Error al obtener los datos del usuario:', error);
            return throwError(() => new Error('Error al obtener los datos del usuario'));
          })
        );
      })
    );
  }



  getUserDataFromBackend(userId: string): Observable<any> {
    return this.auth0.getAccessTokenSilently().pipe(  // Obtenemos el token con getAccessTokenSilently()
      switchMap((token) => {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);  // Añadimos el token al header
        return this.http.get(`${environment.apiUrl}/users/user_data/${userId}`, { headers, responseType: 'json' });  // Realizamos la solicitud al backend
      })
    );
  }

}