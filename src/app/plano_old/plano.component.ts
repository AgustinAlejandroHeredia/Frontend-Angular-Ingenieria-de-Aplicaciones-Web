import { Component } from '@angular/core';
import { ReactiveFormsModule ,FormControl, FormGroup, Validator } from '@angular/forms';
import { PlanoService } from './plano.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-plano',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  providers: [
    PlanoService,
  ],
  templateUrl: './plano.component.html',
  //styleUrl: './plano.component.css'
})
export class PlanoComponent {



  planoForm = new FormGroup({
    nombre : new FormControl(''),
  })

  newPanoForm = new FormGroup({
    nombre : new FormControl(''),
    proyectoid : new FormControl(''),
  })



planos: any[] = [] // no se puede poner privada porque tiene que ser visible por el html
plano_id = 'vacio'

constructor(private planoService: PlanoService) {}

ngOnInit(): void{
  this.loadPlanos() 
}

// mostrar todos los planos (TESTED)
async loadPlanos(){
  this.planoService.getPlanos().subscribe({
    next: (data) => {
      this.planos = data;
      console.log('Planos obtenidos:', this.planos);
    },
    error: (err) => {
      console.error('Error al obtener los planos:', err);
    }
  });
}


// crear plano (TESTED)
async createPlano(){
  console.log(this.newPanoForm.value)
  if (this.newPanoForm.valid) {
    this.planoService.createPlano(this.newPanoForm.value).subscribe({
      next: async () => {
        await alert("Plano creado exitosamente")
        this.loadPlanos() // refresca el listado de planos
      },
      error: async (e: any) => {
        console.log(e)
        await alert("Error al crear el plano")
      }
    });
  }
}


// hacer el update : como tal los guarda bien en el form, pero no se completan los input con los datos del form en si
setPlanoForm(plano: any){
  console.log('setPlanoFrom')
  this.plano_id = plano._id
  this.planoForm.patchValue({
    nombre: plano.nombre,
  })
}


// editar plano ()
async editePlano(){
  if(this.plano_id != 'vacio'){
    const userChoice = await confirm("Editar plano?")
    if(userChoice){
      this.planoService.updatePlano(this.plano_id, this.planoForm.value).subscribe({
        next: async () => {
          await alert("Plano editado exitosament")
          this.loadPlanos() // refresca el listado de planos (ultimo)
        },
        error: async (e: any) => {
          console.log(e)
          await alert("Error al editar el plano")
        }
      })
    }
  }else{
    await confirm("No ha seleccionado plano para editar")
  }
}


// borrar plano (TESTED)
async deletePlano(plano: any){
  const userChoice = await confirm("Eliminar plano?")
  if(userChoice){
    console.log(plano._id)
    this.planoService.deletePlano(plano._id).subscribe({
      next: async () => {
        await alert("Plano eliminado exitosamente")
        this.resetPlanoForm() // agregada a lo ultimo
        this.loadPlanos() // refresca el listado de planos
      },
      error: async (e:any) => {
        console.log(e)
        await alert("Error eliminando el plano seleccionado")
      }
    })
  }
}


// resetea en blanco el formulario de creacion de un plano nuevo
resetPlanoForm(){
  this.plano_id = 'vacio'
  this.planoForm = new FormGroup({
    nombre : new FormControl(''),
  })
}


}
