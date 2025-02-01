import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearOrganizacionService } from './crear-organizacion.service';
import { AuthService } from '@auth0/auth0-angular';
import { OrganizacionService } from '../organizacion/organizacion.service';

@Component({
  selector: 'app-crear-organizacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './crear-organizacion.component.html',
  styleUrl: './crear-organizacion.component.css'
})
export class CrearOrganizacionComponent implements OnInit{

  user_id: string | undefined
  user_name: string | undefined

  organizacionForm = new FormGroup({
    nombre : new FormControl('', Validators.required),
    direccion : new FormControl('', Validators.required),
    contactos : new FormControl('', Validators.required),
  })

  formaForm = new FormGroup({
    letra : new FormControl('', Validators.required),
    numero : new FormControl('',[ Validators.required, Validators.pattern('^[0-9]+$') ]),
    year : new FormControl('',[ Validators.required, Validators.pattern('^[0-9]+$') ]),
    partida : new FormControl('', Validators.required),
  })

  constructor(private crearOrganizacionService: CrearOrganizacionService, private auth: AuthService, private organizacionService: OrganizacionService){}

  async ngOnInit(): Promise<void> {
    await this.auth.user$.subscribe(user => {
      this.user_name = user?.name;
      this.user_id = user?.sub
    })
    this.organizacionService.setOrganizacionNombre('')
  }

  async crearOrganizacion(){
    if (this.organizacionForm.valid && this.formaForm.valid) {
      const userChoice = await confirm('Confirmar creacion de proyecto?');
      if (userChoice) {

        const user = {
          id: this.user_id,
          nombre: this.user_name
        }

        this.crearOrganizacionService.crearOrganizacion(this.organizacionForm.value, this.formaForm.value, user).subscribe({
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
      alert('Todos los campos deben ser completados para poder realizar la operacion')
    }
  }
}