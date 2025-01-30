import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccesoService } from './acceso.service';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

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

  constructor(private readonly accesoService: AccesoService, private auth: AuthService, private router: Router){}

  organizaciones: any[] = []

  // botones
  botoninicial: boolean = true
  ingresoToken: boolean = false

  token: any

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.auth.user$)
    const userId = user?.sub
    await this.getOrganizaciones(userId!)
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

  validarToken(){
    this.ingresoToken=false
    this.botoninicial=true

  }

  seleccionarOrganizacion(organizacion: any){
    console.log('Se selecciona la organizacion con id ',organizacion._id)
    localStorage.setItem('organizacion', JSON.stringify(organizacion))
    this.router.navigate(['/home', organizacion._id])
  }

}
