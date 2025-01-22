import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if(isAuthenticated){
        this.router.navigate(['/home'])
        console.log('User authenticated')
      }else{
        console.log('User NOT authenticated')
      }
    })
  }

  login(){
    this.auth.loginWithRedirect()
  }

  logout(){}

}
