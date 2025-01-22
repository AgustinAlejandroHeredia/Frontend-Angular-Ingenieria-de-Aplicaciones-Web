import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prueba-roles',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div *ngIf="roles.includes('Admin')">
      <h1>Bienvenido, Admin</h1>
    </div>
    <div *ngIf="!roles.includes('Admin')">
      <h1>No tienes permiso para ver esta página</h1>
    </div>
  `,
  styleUrl: './prueba-roles.component.css'
})
export class PruebaRolesComponent {
  roles: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getUserRoles().subscribe({
      next: (response) => {
        this.roles = response.roles;
      },
      error: () => {
        console.error('Error al obtener los roles');
      },
    });
  }
}
