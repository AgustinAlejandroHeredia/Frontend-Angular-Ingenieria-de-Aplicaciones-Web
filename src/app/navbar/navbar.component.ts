import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private auth: AuthService, private router: Router){}

  user_name: string | undefined
  rol: string | undefined

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user_name = user?.name
      // implementar roles
    })
  }

  redirectTo(url: string): void {
    this.router.navigate([url])
  }

  async logout(){
    const userChoice = await confirm("Confirmar cierre de sesion")
    if(userChoice){
      this.auth.logout()
    }
  }

}
