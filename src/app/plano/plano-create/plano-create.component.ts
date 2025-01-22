import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanoService } from '../plano.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArchivosService } from '../../archivos/archivos.service';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-plano',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './plano-create.component.html',
  styleUrl: './plano-create.component.css'
})
export class PlanoCreateComponent implements OnInit{

  newPlanoForm = new FormGroup({
    nombre : new FormControl(''),
    especialidad : new FormControl(''),
    proyectoid : new FormControl(''),
  })

  plano: any = {}
  idProyecto: string | null = null;

  selectedFile: File | null = null;

  constructor(private planoService:PlanoService, private archivosService:ArchivosService, private route:ActivatedRoute, private router:Router, private auth: AuthService){}

  ngOnInit(): void {
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')
    // agrega la id del proyecto al formulario
    this.newPlanoForm.patchValue({proyectoid: String(this.idProyecto)})
  }

  async createPlano(){
    const userChoice = await confirm("Crear plano?")
    if(userChoice){
      if(this.newPlanoForm.valid){
        this.planoService.createPlano(this.newPlanoForm.value).subscribe({
          next: async () => {
            await alert("Plano creado exitosamente")
            this.router.navigate(['/proyecto', this.idProyecto])
          },
          error: async (e: any) => {
            await alert("Error al crear plano, intente nuevamente")
          }
        })
      }
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const validTypes = ['application/pdf', 'image/png']; // tipos MIME validos
  
      if (!validTypes.includes(file.type)) {
        alert('Solo se permiten archivos PDF o PNG.');
        this.selectedFile = null; // limpia el archivo seleccionado si no es valido
        return;
      }
  
      this.selectedFile = file; // archivo valido
      console.log('Archivo seleccionado:', this.selectedFile);
    }
  }

  async onSubmit() {
    if (this.selectedFile != null) {
      try {

        const user = await firstValueFrom(this.auth.user$)
        const username = user?.name || ''

        this.archivosService.createArchivo(this.selectedFile, username)
          .subscribe({
            next: async () => {
              alert("Archivo enviado")
            },
            error: async (e) => {
              console.log(e)
              alert("Error al enviar archivo")
            }
          });

      }catch (error){
        console.log('Error al obtener el usuario: ', error)
      }
    } else {
        alert("Debe seleccionar un archivo")
    }
  }

  // se envia documento a backend
  enviarDocumento():void {
    
  }

}
