import { Injectable } from '@angular/core';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';

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
}