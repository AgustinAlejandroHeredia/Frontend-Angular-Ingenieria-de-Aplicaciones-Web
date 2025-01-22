import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAuth0({
      domain: 'dev-s2w5lzkgxmbf0wl0.us.auth0.com',
      clientId: 'S1QqgeE9Tu27X8RYsxFnhtshIeMDZIte',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    }),
  ]
};
