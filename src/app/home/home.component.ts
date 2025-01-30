import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { HomeService } from './home.service';
import { Observable, firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  providers: [
    HomeService
  ],
  templateUrl: './home.component.html',
  //styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(public auth: AuthService, private homeService: HomeService, private router: Router){}

  proyectos: any[] = []

  searchTerm: string = '';
  sortOrder: string = '';
  user_name: string | undefined;
 
  async ngOnInit(): Promise<void> {
    await this.auth.user$.subscribe(user => {
      this.user_name = user?.name;
    })
    console.log(this.getProyectosByUser())
  }

  getStatus(status: string): string {
    const status_normalizado = status.toLowerCase()
    switch (status_normalizado) {
      case 'en espera': return 'status pending';
      case 'desaprobado': return 'status rejected';
      case 'aprobado': return 'status approved';
      default: return '';
    }
  }

  /*
  get filteredProjects() {
    let filtered = this.projects.filter(project =>
      project.location.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      project.file.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    if (this.sortOrder === 'category') {
      filtered = filtered.sort((a, b) => a.category.localeCompare(b.category));
    }

    return filtered;
  }
  */

  async getProyectosByUser(){
    const user = await firstValueFrom(this.auth.user$)
    const userId = user?.sub
    console.log(userId)
    this.homeService.getProyectosByUser(String(userId)).subscribe({
      next: (data) => {
        this.proyectos = data;
        console.log('Proyectos obtenidos:', this.proyectos);
      },
      error: (err) => {
        console.error('Error al obtener los proyectos:', err);
      }
    })
  }

  verProyecto(idProyecto: string){
    this.router.navigate(['/proyecto', idProyecto])
  }
  
}
