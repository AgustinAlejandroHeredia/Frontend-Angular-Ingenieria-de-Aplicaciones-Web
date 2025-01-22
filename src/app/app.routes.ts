import { Routes } from '@angular/router';
import { PlanoComponent as PlanoOldComponent } from './plano_old/plano.component';
import { PlanoViewComponent } from './plano/plano-view/plano-view.component';
import { PlanoCreateComponent } from './plano/plano-create/plano-create.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProyectoComponent } from './proyecto/proyecto.component';
import { PruebaRolesComponent } from './prueba-roles/prueba-roles.component';

import { AuthGuard } from '@auth0/auth0-angular';
import { PlanoModComponent } from './plano/plano-mod/plano-mod.component';

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch: 'full'},
    {path:'home', component: HomeComponent, canActivate: [AuthGuard]},
    {path:'planos_old', component: PlanoOldComponent, canActivate: [AuthGuard]},
    {path:'plano_view/:idPlano', component: PlanoViewComponent, canActivate: [AuthGuard]},
    {path:'plano_create/:idProyecto', component: PlanoCreateComponent, canActivate: [AuthGuard]},
    {path:'plano_mod/:idPlano', component: PlanoModComponent, canActivate: [AuthGuard]},
    {path:'proyecto/:idProyecto', component: ProyectoComponent, canActivate: [AuthGuard]},
    {path:'login', component: LoginComponent},
    {path: 'pueba_roles', component: PruebaRolesComponent},
    {path: '**', redirectTo: 'login', pathMatch: 'full'}
];