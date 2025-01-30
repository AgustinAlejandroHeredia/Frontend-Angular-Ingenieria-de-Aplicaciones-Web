import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PlanoService } from '../plano.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

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
  
  plano: any = {}
  idPlano: string | null = null;
  tipo: string | null = null
  nombre: string | null = null


  nuevoNombre: string | null = null;
  nuevoArchivo: File | null = null
  selectedFile: File | null = null;

  archivo: {
    _id: string;
    filename: string;
    encoding: string;
    mimetype: string;
    fecha_creacion: number;
    size: number;
    subido_por: string;
    tipo: string;
    buffer: ArrayBuffer; // Contenido binario del archivo
  } | null = null;
  
  constructor(private planoService:PlanoService, private route:ActivatedRoute, private auth: AuthService){}

  async ngOnInit(): Promise<void> {
    this.idPlano = this.route.snapshot.paramMap.get('idPlano')
    await this.loadPlano()
    this.actualizarInfo(String(this.plano.filename))
  }

  loadPlano(): Promise<void>{
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

  procesarNombre(nombre: string){
    const aux = nombre.lastIndexOf('.')
    this.tipo = nombre.substring(aux+1)
    this.nombre = nombre.substring(0, aux)
  }

  actualizarInfo(nombre: string){
    this.procesarNombre(nombre)
    this.selectedFile = this.plano
  }

  onFileSelected(event: Event): void {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const validTypes = ['application/pdf', 'image/png']; // tipos MIME validos
    
        if (!validTypes.includes(file.type)) {
          alert('Solo se permiten archivos PDF o PNG.');
          this.nuevoArchivo = null; // limpia el archivo seleccionado si no es valido
          return;
        }
    
        this.nuevoArchivo = file; // archivo valido
        console.log('Archivo seleccionado:', this.nuevoArchivo);
      }
    }

  async editarArchivo(plano: File){
    console.log('EDITAR ARCHIVO')
    console.log(this.nombre)
    console.log(this.selectedFile)
    console.log()

    const userChoice = await confirm("Editar plano?")
    if(userChoice){
      
      console.log()

    }
  }

}
