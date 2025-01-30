import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';

import { apiUrl } from '../../environments/environment';

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

  getUserProfile() {
    return this.auth0.user$;
  }

  getToken() {
    //return this.auth0.idToken$;
    return this.auth0.idTokenClaims$
  }

  getProtectedResource() {
    return this.http.get('http://localhost:3000/profile');
  }

  /*
  async isAdmin(){
    try {
      const token = await this.auth0.getAccessTokenSilently().toPromise();

      if (!token) {
        console.log('No se obtuvo el token');
        return false;
      }

      // Decodificar el token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('El token no es un JWT válido');
      }

      const payloadBase64 = tokenParts[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const permissions = payload.permissions || [];

      console.log('----- Permission -----');
      console.log('Permission -> ', permissions);

      const isAdmin = permissions.includes('admin');

      if (isAdmin) {
        console.log('Administrador Admitido');
      } else {
        console.log('No es administrador');
      }

      console.log('----------------------');
      return isAdmin;
    } catch (error) {
      console.error('Error al procesar el token:', error);
      return false;
    }
  }
    */

  async checkPermission_old(permission: string): Promise<boolean> {
    try {
      const token = await this.auth0.getAccessTokenSilently().toPromise();
  
      if (!token) {
        console.log('No se obtuvo el token');
        return false;
      }
  
      // Decodificar el token
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('El token no es un JWT válido');
      }
  
      const payloadBase64 = tokenParts[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      const permissions = payload.permissions || [];
  
      console.log('----- Permission -----');
      console.log('Permission -> ', permissions);
  
      const hasPermission = permissions.includes(permission);
  
      if (hasPermission) {
        console.log(`${permission.charAt(0).toUpperCase() + permission.slice(1)} Admitido`);
      } else {
        console.log(`No es ${permission}`);
      }
  
      console.log('----------------------');
      return hasPermission;
    } catch (error) {
      console.error('Error al procesar el token:', error);
      return false;
    }
  }

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
}