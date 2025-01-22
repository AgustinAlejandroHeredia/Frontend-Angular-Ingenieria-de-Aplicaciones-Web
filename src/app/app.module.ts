import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AuthModule } from '@auth0/auth0-angular';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PlanoComponent } from './plano_old/plano.component';

import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { NavbarComponent } from './navbar/navbar.component';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [
    AppComponent,
    PlanoComponent,
    NavbarComponent,
    FileUploadComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}