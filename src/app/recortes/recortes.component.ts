import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RecortesService } from './recortes.service';
import { AuthService } from '@auth0/auth0-angular';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-recortes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './recortes.component.html',
  styleUrl: './recortes.component.css'
})
export class RecortesComponent implements OnInit {

  constructor(private recortesService: RecortesService, private auth: AuthService){}

  recortes: any[] = []

  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.auth.user$)
    const userId = user?.sub
    console.log('ID: ', userId)
    await this.getRecortes(userId!)
  }

  getRecortes(userId: string){
    this.recortesService.getRecortes(userId).subscribe({
      next: (data) => {
        this.recortes = data;
        console.log('Recortes obtenidos:', this.recortes);
      },
      error: (err) => {
        console.error('Error al obtener los recortes:', err);
      }
    })
  }

  descargarArchivo(id_backblaze: string){}
 
}
