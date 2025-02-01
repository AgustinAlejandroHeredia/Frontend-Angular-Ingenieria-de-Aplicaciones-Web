import { CommonModule } from '@angular/common';
import { Component, numberAttribute, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService as AuthServices } from '../../services/auth.service';
import { ProyectoService } from '../proyecto.service';
import { firstValueFrom } from 'rxjs';

import { OrganizacionService } from '../../organizacion/organizacion.service';

@Component({
  selector: 'app-proyecto-mod',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './proyecto-mod.component.html',
  styleUrl: './proyecto-mod.component.css'
})
export class ProyectoModComponent implements OnInit{

  idOrganizacion: string | null = null
  idProyecto: string | null = null
  proyecto: any
  organizacion: any
  usuariosProyecto: any[] = []
  usuariosOrganizacion: any[] = []

  proyectoForm = new FormGroup({
    nombre : new FormControl(''),
    expediente : new FormControl(''),
    obra : new FormControl(''),
    destino : new FormControl(''),
    ubicacion : new FormControl(''),
    escala : new FormControl(''),
    otros : new FormControl(''),
    referencias : new FormControl(''),
    antecedentes : new FormControl(''),
    propietario : new FormControl(''),
    proyectistas : new FormControl(''),
    direccion_tecnica : new FormControl(''),
    estado: new FormControl(''),
  })

  estado: string | undefined
  estados: string[] = ["Aprobado", "Desaprobado", "Revision"]
  estadoSeleccionado: string | undefined

  user_id: string | undefined
  user_name: string | undefined
  admin: boolean = false
  creator: boolean = false

  userData: any

  constructor(private proyectoService: ProyectoService, private auth: AuthService, private route: ActivatedRoute, private authServices: AuthServices, private organizacionesService: OrganizacionService, private cdr: ChangeDetectorRef){}

  async ngOnInit(): Promise<void> {
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')
    this.idOrganizacion = this.route.snapshot.paramMap.get('idOrganizacion')
    await this.auth.user$.subscribe(user => {
      this.user_name = user?.name;
      this.user_id = user?.sub
    })
    await this.getProyecto()
    await this.getOrganizacion()
    await this.setProyectoForm()
    this.estado = this.proyecto.estado
    this.estadoSeleccionado = this.proyecto.estado
    this.generarListas()
    this.admin = await this.authServices.isAdmin()
    this.creator = await this.authServices.isCreator()
  }

  generarListas(){
    this.usuariosProyecto = this.proyecto.usuarios.filter((usuario: { id: string; nombre: string }) => usuario.id !== this.user_id)
    this.usuariosOrganizacion = this.organizacion.usuarios.filter((usuario: { id: string; nombre: string }) => usuario.id !== this.user_id)
    this.generarListaInvitaciones()
  }

  // elimina de la lista de invitaciones los usuaios que ya estan en el proyuecto
  generarListaInvitaciones(){
    const res = this.usuariosOrganizacion.filter(usuario1 => 
      !(this.usuariosProyecto).some(usuario2 => usuario2.id === usuario1.id)
    )
    this.usuariosOrganizacion = res
  }

  async getProyecto(): Promise<void>{
      try {
        this.proyecto = await firstValueFrom(this.proyectoService.getProyecto(String(this.idProyecto)));
        console.log('Proyecto obtenido exitosamente:', this.proyecto);
      } catch (err) {
        console.error('Error al obtener el proyecto:', err);
      }
  }

  async getOrganizacion(): Promise<void>{
    try {
      this.organizacion = await firstValueFrom(this.organizacionesService.getOrganizacionById(String(this.idOrganizacion)));
      console.log('Organizacion obtenida exitosamente:', this.proyecto);
    } catch (err) {
      console.error('Error al obtener el organizacion:', err);
    }
  }

  async editarProyecto() {
    if (this.proyectoForm.valid) {
      const userChoice = await confirm('Confirmar edicion de proyecto?');
      if (userChoice) {

        this.proyectoForm.patchValue({ estado: this.estadoSeleccionado })

        this.proyectoService.editarProyecto(this.idProyecto!, this.proyectoForm.value).subscribe({
          next: async () => {
            await alert("Plano editado exitosament")
            await this.getProyecto()
            await this.generarListas();
          },
          error: async (e: any) => {
            console.log(e)
            await alert("Error al editar el plano")
          }
        })
      }
    } else {
      console.log('El formulario no es valido');
    }
  }

  setProyectoForm(){
    this.proyectoForm.patchValue({
      nombre: this.proyecto.nombre,
      expediente : this.proyecto.expediente,
      obra : this.proyecto.obra,
      destino : this.proyecto.destino,
      ubicacion : this.proyecto.ubicacion,
      escala : this.proyecto.escala,
      otros : this.proyecto.otros,
      referencias : this.proyecto.referencias,
      antecedentes : this.proyecto.antecedentes,
      propietario : this.proyecto.propietario,
      proyectistas : this.proyecto.proyectistas,
      direccion_tecnica : this.proyecto.direccion_tecnica,
      estado: this.proyecto.estado,
    })
  }

  async eliminarUser(idUsuario: string, nombreUsuario: string) {
    const userChoice = await confirm('Eliminar al usuario ' + nombreUsuario + ' del proyecto?');
    if (userChoice) {
        this.proyectoService.eliminarUsuario(this.idProyecto!, idUsuario).subscribe({
            next: async (res) => {
                console.log('Respuesta del backend:', res);
                await alert("Usuario eliminado exitosamente");
                await this.getProyecto()
                await this.generarListas();
            },
            error: async (err) => {
                console.error('Error al eliminar usuario:', err);
                await alert("Error al eliminar usuario");
                this.generarListas();
            }
        });
    }
}

  async invitarUser(idUsuario: string, nombreUsuario: string){
    const userChoice = await confirm('Invitar al usuario '+nombreUsuario+' al proyecto?')
    if(userChoice){
      this.proyectoService.cargarUsuario(this.idProyecto!, idUsuario, nombreUsuario).subscribe({
        next: async () => {
          await alert("Usuario añadido exitosamente")
          await this.getProyecto()
          await this.generarListas()
        },
        error: async (e: any) => {
          console.log(e)
          await alert("Error al añadir usuario")
        }
      })
    }
  }
}