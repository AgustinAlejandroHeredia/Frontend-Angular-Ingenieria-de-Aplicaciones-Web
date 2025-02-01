import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService as AuthServices } from '../services/auth.service';
import { OrganizacionService } from '../organizacion/organizacion.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './navbar.component.html',
  //styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  constructor(private auth: AuthService, private router: Router, public authServices: AuthServices, private organizacionService: OrganizacionService, private route: ActivatedRoute){}

  user_name: string | undefined
  admin: boolean = false
  creator: boolean = false
  nombre_organizacion: string | undefined
  organizacion: any

  async ngOnInit(): Promise<void> {
    await this.auth.user$.subscribe(user => {
      console.log('USER -> ', user)
      this.user_name = user?.name
    })

    this.admin = await this.authServices.isAdmin()
    this.creator = await this.authServices.isCreator()

    //this.organizacion = JSON.parse(localStorage.getItem('organizacion') || '[]');

    // obtiene el nombre de la organizacion a mostrar
    this.organizacionService.organizacionSeleccionada$.subscribe(nombre => {
      this.nombre_organizacion = nombre
    })
  }

  redirectTo(url: string): void {
    this.router.navigate([url])
  }

  redirectToHome(){
    try{
      const organizacion = JSON.parse(localStorage.getItem('organizacion') || '[]')
      this.router.navigate(['/home/'+organizacion.idOrganizacion])
    }catch{
      this.router.navigate(['/acceso'])
    }
  }

  redirectToAdminUsers(){
    try{
      const organizacion = JSON.parse(localStorage.getItem('organizacion') || '[]')
      this.router.navigate(['admin_users/',organizacion.idOrganizacion])
    }catch{
      this.router.navigate(['/acceso'])
    }
  }

  redirectToCreator(){
    this.router.navigate(['crear_organizacion'])
  }

  redirectToRecortes(){
    try{
      const organizacion = JSON.parse(localStorage.getItem('organizacion') || '[]')
      this.router.navigate(['mis_recortes/',organizacion.idOrganizacion])
    }catch{
      this.router.navigate(['/acceso'])
    }
  }

  async logout(){
    const userChoice = await confirm("Confirmar cierre de sesion")
    if(userChoice){
      this.auth.logout()
    }
  }

  getRutaActual(){
    return this.router.url
  }

}
