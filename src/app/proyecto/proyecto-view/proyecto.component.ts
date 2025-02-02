import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../proyecto.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService as AuthServices } from '../../services/auth.service';
import { ActualizarNavbarService } from '../../services/actualizar-navbar.service';


// necesita usar funciones de plano que ya estan declaradas en los service de planos
import { PlanoService } from '../../plano/plano.service';

@Component({
  selector: 'app-proyecto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  providers: [
    ProyectoService,
  ],
  templateUrl: './proyecto.component.html',
  //styleUrl: './proyecto.component.css'
})
export class ProyectoComponent implements OnInit{

  constructor(private proyectoService: ProyectoService, private planoService:PlanoService, private route: ActivatedRoute, public auth:AuthService, private router:Router, private authServices:AuthServices, private actualizarNavbarService: ActualizarNavbarService){}

  planos: any[] = []
  proyecto: any = {}
  idOrganizacion: string | null = null
  idProyecto: string | null = null
  user_name: string | undefined
  admin: boolean = false
  creator: boolean = false

  async ngOnInit(): Promise<void> {
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')
    this.idOrganizacion = this.route.snapshot.paramMap.get('idOrganizacion')
    await this.auth.user$.subscribe(user => {
      this.user_name = user?.name;
    })
    await this.getProyecto()
    await this.getPlanos()
    this.admin = await this.authServices.isAdmin()
    this.creator = await this.authServices.isCreator()
    await this.actualizarNavbarService.validarNavbar(this.idOrganizacion!)
  }

  getStatus(status: string): string {
    const status_normalizado = status.toLowerCase()
    switch (status_normalizado) {
      case 'revision': return 'status pending';
      case 'desaprobado': return 'status rejected';
      case 'aprobado': return 'status approved';
      default: return '';
    }
  }

  // debe sincronizar la consulta de los datos
  async getProyecto(): Promise<void>{
    try {
      this.proyecto = await firstValueFrom(this.proyectoService.getProyecto(String(this.idProyecto)));
      console.log('Proyectos obtenidos:', this.proyecto);
    } catch (err) {
      console.error('Error al obtener los proyectos:', err);
    }
  }

  // busca los planos que hay en el proyecto
  async getPlanos(): Promise<void>{
    try {
      this.planos = await firstValueFrom(this.proyectoService.getPlanos(String(this.idProyecto)));
      console.log('Planos obtenidos:', this.planos)
    } catch (err) {
      console.error('Error al obtener los planos:', err)
    }
  }

  verPlano(idPlano: string){
    this.router.navigate(['/plano_view', idPlano, this.idProyecto])
  }

  modPlano(idPlano: string){
    this.router.navigate(['/plano_mod', idPlano])
  }

  async deletePlano(idPlano: string){
    const userChoice = await confirm("Eliminar plano?")
    if(userChoice){
      this.planoService.deletePlano(idPlano).subscribe({
        next: async () => {
          await alert("Plano eliminado exitosamente")
          this.getPlanos()
        },
        error: async (e:any) => {
          console.log(e)
          await alert("Error al eliminar el plano seleccionado, intente nuevamente")
        }
      })
    }
  }

  crearPlano(){
    this.router.navigate(['/plano_create', this.idProyecto])
  }

  modificarProyecto(){
    this.router.navigate(['/modificar_proyecto', this.idProyecto, this.idOrganizacion])
  }

}
