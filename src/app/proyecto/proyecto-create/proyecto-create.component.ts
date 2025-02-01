import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../proyecto.service';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService as AuthServices } from '../../services/auth.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-proyecto-create',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './proyecto-create.component.html',
  styleUrl: './proyecto-create.component.css'
})
export class ProyectoCreateComponent implements OnInit{

  constructor(private proyectoService: ProyectoService, private route: ActivatedRoute, private auth: AuthService){}

  idOrganizacion: string | null = null
  user_id: string | undefined
  user_name: string | undefined

  proyectoForm = new FormGroup({
      nombre : new FormControl('', Validators.required),
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
      id_organizacion: new FormControl('')
  })

  // en desuso
  estado: string | undefined
  estados: string[] = ["Aprobado", "Desaprobado", "Revisión"]
  estadoSeleccionado: string | undefined

  async ngOnInit(): Promise<void> {
    this.idOrganizacion = this.route.snapshot.paramMap.get('idOrganizacion')
    await this.auth.user$.subscribe(user => {
      this.user_name = user?.name;
      this.user_id = user?.sub
    })
  }

  async crearProyecto(){
    if (this.proyectoForm.valid) {
      const userChoice = await confirm('Confirmar creacion de proyecto?');
      if (userChoice) {

        // por default comienza en revision
        this.proyectoForm.patchValue({ estado: "Revision" })

        // ingresa la organizacion actual
        this.proyectoForm.patchValue({ id_organizacion: this.idOrganizacion })

        const user = {
          id: this.user_id,
          nombre: this.user_name
        }

        this.proyectoService.crearProyecto(this.proyectoForm.value, user).subscribe({
          next: async () => {
            await alert("Proyecto creado exitosamente")
          },
          error: async (e: any) => {
            console.log(e)
            await alert("Error al crear proyecto")
          }
        })
      }
    } else {
      alert('Debe ingresar el nombre del proyecto para poder crearlo')
    }
  }

}
