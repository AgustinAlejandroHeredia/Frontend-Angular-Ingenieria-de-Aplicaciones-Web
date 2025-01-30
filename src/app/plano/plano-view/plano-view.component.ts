import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';
import { PlanoService } from '../plano.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';

// recortes
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-plano-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './plano-view.component.html',
  styleUrl: './plano-view.component.css'
})
export class PlanoViewComponent implements OnInit{

  idPlano: string | null = null
  idProyecto: string | null = null
  plano: any
  planoUrl: SafeResourceUrl | null = ''
  tipo: string | null = null

  // recortes
  habilitarRecorte: boolean = false
  seleccionPaginaRecorte: boolean = false
  habilitarContenedor: boolean = true
  // png
  private cropper!: Cropper;
  paginaSeleccionada: number = 1

  url_para_pdf: any // se utiliza una url sin sanitizer, sino pdf-lib no funciona

  imageUrl: any

  recorteForm = new FormGroup({
    especialidad : new FormControl('', Validators.required),
    etiquetas: new FormControl('', Validators.required)
  })

  cantPaginas: number[] = []

  @ViewChild('pngImage') pngImage!: ElementRef<HTMLImageElement>

  constructor(private route:ActivatedRoute, private planoService: PlanoService, private sanitizer: DomSanitizer, private auth: AuthService){
    // npm install pdfjs-dist@3.4.120 --> sino no funciona correctamente
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  }

  async ngOnInit(): Promise<void> {
    this.idPlano = this.route.snapshot.paramMap.get('idPlano')
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')
    await this.getPlano()
    this.tipo = this.plano.type
    console.log('PLANO -> ', this.plano)
    await this.verPlano()

    if(this.tipo == 'pdf'){
      await this.obtenerCantidadPaginas()
    }
  }

  // TESTED
  async verPlano(): Promise<void>{
    return new Promise<void>((resolve, reject) => {
      this.planoService.verPlano(this.plano.id_plano_backblaze).subscribe(
        (data) => {
          const url_para_view = URL.createObjectURL(data)
          this.url_para_pdf = url_para_view
          this.planoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url_para_view)
          resolve()
        },
        (error) => {
          console.log('ERROR verPlano() (component) ->', error)
          reject(error)
        })
    })
  }

  // TESTED
  async getPlano(){
    this.plano = await firstValueFrom(this.planoService.getPlanoById(this.idPlano!));
  }

  // boton : <button (click)="downloadPlano('nombre-del-archivo')">Descargar Archivo</button>

  // TESTED
  downloadPlano(){
    console.log('downloadPlano (component) -> ', this.plano)
    this.planoService.downloadPlano(this.plano.filename, this.plano.id_plano_backblaze)
  }

  // ---- RECORTES ----

  // dependiendo de que tipo de archivo sea llama a una funcion u otra
  recortar(){
    console.log('Se llama a recortar(), tipo=', this.tipo)
    if(this.tipo == 'png'){
      this.recortarImagen()
    }else{
      this.seleccionPaginaRecorte = true
      //this.recortarPdf()
    }
  }

  generarRecorte(){
    if(this.cropper){

      if(this.recorteForm.valid){

        // deshabilita la generacion de recortes
        this.habilitarRecorte = false
        this.seleccionPaginaRecorte = false
        this.habilitarContenedor = false

        const cropperedCanvas = this.cropper.getCroppedCanvas()
        if(cropperedCanvas){
          cropperedCanvas.toBlob(async (blob) => {
            const recorte = new File([blob!], this.planoService.generarNombreRecorte(this.plano.filename), {type: 'image/png'})
            const user = await firstValueFrom(this.auth.user$)
            const username = user?.name || ''

            // finaliza la seleccion de recorte
            this.cropper.destroy()

            // genera registro de recorte
            const user_id = user?.sub
            this.planoService.createRecorte(recorte, username, String(user_id), String(this.idPlano), String(this.recorteForm.get('especialidad')?.value), String(this.recorteForm.get('etiquetas')?.value)).subscribe({
              next: () => {

                // se descarga el recorte
                const url = URL.createObjectURL(recorte);
                const a = document.createElement('a');
                a.href = url;
                a.download = this.cambiarExtension(recorte.name);
                a.click();

                alert('Recorte generado exitosamente')

              },
              error: (err) => {

                alert('Error al generar el recorte, por favor intente nuevamente')
                console.log('ERROR: ',err)

              }
            })

            // subida de recorte a backblaze

          })
        } else {
          console.log('NO SE PUDO GENERAR EL CANVAS RECORTADO')
        }
      } else {
        alert('No se han comlpetado los campos correspondientes al recorte.')
      }
    } else {
      console.log('NO SE PUDO INICIALIZAR CROPPER')
    }
  }

  // ---- IMG ----

  recortarImagen(){
    try {
      const imagen = document.getElementById('png-presente') as HTMLImageElement
      this.cropper = new Cropper(imagen, {
        aspectRatio: NaN, // o 16 / 9
        viewMode: 1,
        background: true,
      })

      // habilita la generacion de recortes
      this.habilitarRecorte = true

    } catch (error) {
      alert('Espere un momento, cargando imagen...')
    }
  }

  generarRecorteImg(){
    if(this.cropper){

      if(this.recorteForm.valid){

        // deshabilita la generacion de recortes
        this.habilitarRecorte = false

        const cropperedCanvas = this.cropper.getCroppedCanvas()
        if(cropperedCanvas){
          cropperedCanvas.toBlob(async (blob) => {
            const recorte = new File([blob!], this.planoService.generarNombreRecorte(this.plano.filename), {type: 'image/png'})
            const user = await firstValueFrom(this.auth.user$)
            const username = user?.name || ''

            // finaliza la seleccion de recorte
            this.cropper.destroy()

            // genera registro de recorte
            const user_id = user?.sub
            this.planoService.createRecorte(recorte, username, String(user_id), String(this.idPlano), String(this.recorteForm.get('especialidad')?.value), String(this.recorteForm.get('etiquetas')?.value)).subscribe({
              next: () => {

                // se descarga el recorte
                const url = URL.createObjectURL(recorte);
                const a = document.createElement('a');
                a.href = url;
                a.download = recorte.name;
                a.click();

                alert('Recorte generado exitosamente')

              },
              error: (err) => {

                alert('Error al generar el recorte, por favor intente nuevamente')
                console.log('ERROR: ',err)

              }
            })
          })
        } else {
          console.log('NO SE PUDO GENERAR EL CANVAS RECORTADO')
        }
      } else {
        alert('No se han comlpetado los campos correspondientes al recorte.')
      }
    } else {
      console.log('NO SE PUDO INICIALIZAR CROPPER')
    }
  }

  // ---- PDF ----

  async obtenerCantidadPaginas(){
    try {
      console.log(this.url_para_pdf!)
      const pdf = await pdfjsLib.getDocument(this.url_para_pdf!).promise
      const pagina_num = pdf.numPages
      this.cantPaginas = Array.from({ length: pagina_num }, (_, i) => i + 1)
    } catch (error) {
      console.log('ERROR AL OBTENER CANTIDAD DE PAGINAS', error)
    }
  }

  // recibe la pagina que el usuario selecciona y dispara las funciones de recorte
  seleccionEvento(evento: Event){
    const res = (evento.target as HTMLSelectElement).value // pagina seleccionada
    this.paginaSeleccionada = Number(res)
    this.recortarPdf()
  }

  async renderPdfComoImagen(): Promise<HTMLImageElement>{
    // Obtener el documento PDF desde la URL
    const pdf = await pdfjsLib.getDocument({ url: this.url_para_pdf }).promise;
    
    // Obtener la página indicada
    const page = await pdf.getPage(this.paginaSeleccionada);
    
    // Crear un canvas para renderizar la página como imagen
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error("No se pudo obtener el contexto del canvas");
    }
    
    const viewport = page.getViewport({ scale: 1 });
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Renderizar la página en el canvas
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    
    // Convertir el canvas a imagen
    const image = new Image();
    image.src = canvas.toDataURL();
    await new Promise(resolve => {
      image.onload = resolve;  // Esperar a que la imagen se cargue completamente
    });
    
    return image;
  }

  async recortarPdf(){
    try {

      const imagenConvertida = await this.renderPdfComoImagen()

      console.log('imagenConvertida -> ', imagenConvertida)

      const container = document.getElementById('cropper-container') as HTMLDivElement
      if(!container){
        throw new Error ('Contenedor no encontrado')
      }

      container.innerHTML = ''
      container.appendChild(imagenConvertida)

      this.cropper = new Cropper(imagenConvertida, {
        aspectRatio: NaN, // o 16 / 9
        viewMode: 1,
        background: true,
      })

      // habilita la generacion de recortes
      this.habilitarRecorte = true

      console.log('recortarPdf finalizado!')

    } catch (error) {
      alert('Espere un momento, cargando imagen...')
      console.log('ERROR -> ',error)
    }
  }

  // le cambia la extension a png para descargarlo bien
  cambiarExtension(nombre: string): string{
    return nombre.replace(/\.pdf$/i, '') + '.png';
  }

}
