import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanoService } from '../plano.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-plano-mod',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './plano-mod.component.html',
  styleUrl: './plano-mod.component.css'
})
export class PlanoModComponent {

  planoForm = new FormGroup({
    nombre : new FormControl(''),
  })

  plano: any = {}
  idPlano: string | null = null;

  constructor(private planoService:PlanoService, private route:ActivatedRoute){}

  async ngOnInit(): Promise<void> {
    this.idPlano = this.route.snapshot.paramMap.get('idPlano')
    await this.loadPlano()
    console.log("COMPROBANDO PLANO: ",this.plano)
    this.setPlanoForm()
  }

  loadPlano(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.planoService.getPlanoById(String(this.idPlano)).subscribe({
        next: (data) => {
          this.plano = data;
          console.log('Plano obtenido:', this.plano);
          resolve();
        },
        error: (err) => {
          console.error('Error al cargar el plano pedido:', err);
          reject(err);
        },
      });
    });
  }

  setPlanoForm(){
    this.planoForm.patchValue({
      nombre: this.plano.nombre,
    })
  }

  async modPlano(){
    if(this.idPlano != 'vacio'){
      const userChoice = await confirm("Editar plano?")
      if(userChoice){
        this.planoService.updatePlano(String(this.idPlano), this.planoForm.value).subscribe({
          next: async () => {
            await alert("Plano editado exitosament")
            this.loadPlano() // refresca el listado de planos (ultimo)
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

}
