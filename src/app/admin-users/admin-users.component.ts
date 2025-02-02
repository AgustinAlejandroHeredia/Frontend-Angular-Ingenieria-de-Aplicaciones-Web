import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActualizarNavbarService } from '../services/actualizar-navbar.service';
import { AdminUsersService } from './admin-users.service';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute } from '@angular/router';
import { AuthService as AuthServices } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { OrganizacionService } from '../organizacion/organizacion.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit{

  idOrganizacion: string | null = null
  organizacion: any

  usuariosOrganizacion: any[] = []

  user_id: string | undefined
  user_name: string | undefined
  admin: boolean = false
  creator: boolean = false

  invitacionMostrar: boolean = false
  email: string | null = null
  duracion: number = 1
  opciones: number[] = [1, 2, 3, 4, 5, 10, 24, 48, 72, 96, 120, 144, 168]

  constructor(private adminUsersService: AdminUsersService, private actualizarNavbarService: ActualizarNavbarService, private auth: AuthService, private route: ActivatedRoute, private authServices: AuthServices, private organizacionesService: OrganizacionService){}  
  
  async ngOnInit(): Promise<void> {
    this.idOrganizacion = this.route.snapshot.paramMap.get('idOrganizacion')
    await this.auth.user$.subscribe(user => {
      this.user_name = user?.name;
      this.user_id = user?.sub
    })
    this.admin = await this.authServices.isAdmin()
    this.creator = await this.authServices.isCreator()
    await this.getOrganizacion()
    this.generarListas()
    //await this.actualizarNavbarService.validarNavbar(this.idOrganizacion!)
  }

  async getOrganizacion(): Promise<void>{
    try {
      this.organizacion = await firstValueFrom(this.organizacionesService.getOrganizacionById(String(this.idOrganizacion)));
      console.log('Organizacion obtenida exitosamente:', this.organizacion);
    } catch (err) {
      console.error('Error al obtener el organizacion:', err);
    }
  }

  // genera la lista con los usuarios de la organizacion menos el admin que esta en la vista
  generarListas(){
    this.usuariosOrganizacion = this.organizacion.usuarios.filter((usuario: { id: string; nombre: string }) => usuario.id !== this.user_id)
  }

  async eliminarUser(userId: string){
    const userChoice = await confirm("Eliminar plano?")
    if(userChoice){
      console.log('Comienza eliminacion...')
      await this.adminUsersService.eliminarUsuarioSeleccionadoDeProyectos(this.idOrganizacion!, userId).subscribe(res => {
        console.log('RESPUESTA DE eliminarUsuarioSeleccionadoDeProyectos() -> ', res)
      })
      await this.adminUsersService.eliminarUsuarioSeleccionadoDeOrganizacion(this.idOrganizacion!, userId).subscribe(res => {
        console.log('RESPUESTA DE eliminarUsuarioSeleccionadoDeOrganizacion() -> ', res)
      })
      await this.generarListas()
      alert('Usaurio eliminado')
    }
  }

  habilitarInvitar(){
    this.invitacionMostrar=true
  }

  enviarInvitacion(){
    this.invitacionMostrar=false
    this.adminUsersService.enviarInvitacion(this.email!, this.duracion!, this.idOrganizacion!).subscribe(res => {
      console.log('Invitacion creada')
    })
    alert('Invitacion enviada exitosamente')
  }

}