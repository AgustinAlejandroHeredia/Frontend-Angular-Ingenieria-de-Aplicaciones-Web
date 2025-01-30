import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlanoService } from '../plano.service';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-plano-create',
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

  plano: any = {}
  idProyecto: string | null = null;

  selectedFile: File | null = null;

  uploadProgress: number = 0;

  constructor(private planoService:PlanoService, private route:ActivatedRoute, private router:Router, private auth: AuthService){}

  ngOnInit(): void {
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')
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

  /* solo para la db
  async onSubmit() {
    if (this.selectedFile != null) {
      try {

        const user = await firstValueFrom(this.auth.user$)
        const username = user?.name || ''

        this.planoService.createPlano(this.selectedFile, username, String(this.idProyecto))
          .subscribe({
            next: async () => {
              alert("Archivo enviado")
              this.router.navigate(['/proyecto', this.idProyecto])
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
  */

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      alert('Debe seleccionar un archivo');
      return;
    }

    if(!this.idProyecto){
      alert('No se selecciona proyecto')
      return
    }

    const allowedExtensions = ['png', 'pdf'];
    const allowedMimeTypes = ['image/png', 'application/pdf'];

    // Verificar extensión y tipo MIME
    const fileExtension = this.selectedFile.name.split('.').pop()?.toLowerCase();
    const mimeType = this.selectedFile.type;

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      alert('Solo se permiten archivos .png o .pdf');
      return;
    }

    if (!allowedMimeTypes.includes(mimeType)) {
      alert('El tipo de archivo no es válido');
      return;
    }

    // se crea registro en planos
    const user = await firstValueFrom(this.auth.user$)
    const username = user?.name || ''
    console.log('LLAMA A CREAR PLANO')

    try {
      this.planoService.createPlano(this.selectedFile, username, this.idProyecto).subscribe({
        next: () => {
          alert('Los archivos se enviaron con exito');
        },
        error: (err) => {
          alert('Hubo un error al enviar los datos, intente nuevamente');
          console.error(err);
        }
      })
      this.router.navigate(['/proyecto', this.idProyecto])
    }catch{
      alert('Hubo un error al eviar los datos, intente nuevamente')
    }
  }
}
