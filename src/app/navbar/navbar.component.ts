import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService as AuthServices } from '../services/auth.service';

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

  constructor(private auth: AuthService, private router: Router, public authServices: AuthServices){}

  user_name: string | undefined
  admin: boolean = false
  creator: boolean = false
  nombre_organizacion: string | undefined

  async ngOnInit(): Promise<void> {
    await this.auth.user$.subscribe(user => {
      this.user_name = user?.name
    })

    this.admin = await this.authServices.isAdmin()
    this.creator = await this.authServices.isCreator()

    const organizacion = JSON.parse(localStorage.getItem('organizacion') || '[]');
    this.nombre_organizacion = organizacion.nombre
  }

  redirectTo(url: string): void {
    this.router.navigate([url])
  }

  redirectToAdminUsers(){
    const organizacion = JSON.parse(localStorage.getItem('organizacion') || '[]');
    this.router.navigate(['admin_users/',organizacion._id])
  }

  redirectToAdminProyectos(){
    const organizacion = JSON.parse(localStorage.getItem('organizacion') || '[]');
    this.router.navigate(['admin_proyectos/',organizacion._id])
  }

  redirectToCreator(){
    console.log('Redirect to creator')
  }

  async logout(){
    const userChoice = await confirm("Confirmar cierre de sesion")
    if(userChoice){
      this.auth.logout()
    }
  }

}
