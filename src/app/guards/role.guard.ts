import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { isDataScheme } from 'pdfjs-dist';
import { firstValueFrom, Observable } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// prueba
import { AuthService as AuthServices } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private authServices: AuthServices) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.authServices.isAdmin().then((isAdmin) => {
        observer.next(isAdmin);
        observer.complete();
      }).catch(() => {
        console.log('Error en canActivate');
        observer.next(false);
        observer.complete();
      });
    });
  }


}

