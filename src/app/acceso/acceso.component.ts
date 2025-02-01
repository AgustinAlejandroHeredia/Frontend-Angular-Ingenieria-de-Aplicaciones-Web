import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccesoService } from './acceso.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { OrganizacionService } from '../organizacion/organizacion.service';
import { ActualizarNavbarService } from '../services/actualizar-navbar.service';

@Component({
  selector: 'app-acceso',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './acceso.component.html',
  styleUrl: './acceso.component.css'
})
export class AccesoComponent implements OnInit{

  constructor(private readonly accesoService: AccesoService, private auth: AuthService, private router: Router, private organizacionService: OrganizacionService, private ActualizarNavbarService: ActualizarNavbarService){}

  organizaciones: any[] = []

  // botones
  botoninicial: boolean = true
  ingresoToken: boolean = false

  token: any

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.auth.user$)
    const userId = user?.sub
    await this.getOrganizaciones(userId!)
    this.organizacionService.setOrganizacionNombre('') // envia el nombre de la organizacion como vacio porque se debe seleccionar ahora
  }

  getOrganizaciones(userId: string){
    this.accesoService.getOrganizaciones(userId).subscribe({
      next: (data) => {
        this.organizaciones = data;
        console.log('Organizaciones obtenidos:', this.organizaciones);
      },
      error: (err) => {
        console.error('Error al obtener las organizaciones:', err);
      }
    })
  }

  ingresarToken(){
    this.botoninicial=false
    this.ingresoToken=true
  }

  async validarToken(){
    this.ingresoToken=false
    this.botoninicial=true
    const user = await firstValueFrom(this.auth.user$)
    const userId = user?.sub
    const userNombre = user?.name
    const res = await firstValueFrom(this.accesoService.validarToken(this.token, userId!, userNombre!))
    if(res){
      alert('Token valido')
      this.getOrganizaciones(userId!) // refresca el contenido, si lleva true es que se añade el user a una nueva organizacion
    }else{
      alert('Token invalido')
    }
  }

  seleccionarOrganizacion(organizacion: any){
    this.organizaciones = organizacion
    console.log('ORGANIZACION SELECCIONADA -> ', organizacion)
    console.log('Se selecciona la organizacion con id ',organizacion._id)
    this.ActualizarNavbarService.actualizarStorage(organizacion._id, organizacion.nombre)
    this.router.navigate(['/home', organizacion._id])
  }
}
