import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PlanoComponent } from './plano_old/plano.component';
import { NavbarComponent } from './navbar/navbar.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    PlanoComponent,
    NavbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'inge-angular';

  constructor(public router: Router){}
}
