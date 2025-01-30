import { Routes } from '@angular/router';
import { PlanoComponent as PlanoOldComponent } from './plano_old/plano.component';
import { PlanoViewComponent } from './plano/plano-view/plano-view.component';
import { PlanoCreateComponent } from './plano/plano-create/plano-create.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProyectoComponent } from './proyecto/proyecto.component';
import { PruebaRolesComponent } from './prueba-roles/prueba-roles.component';
import { RecortesComponent } from './recortes/recortes.component';

import { AuthGuard } from '@auth0/auth0-angular';
import { PlanoModComponent } from './plano/plano-mod/plano-mod.component';

// guards
import { AdminGuard } from './guards/role.guard';
import { CreatorGuard } from './guards/creator.guard';
import { AccesoComponent } from './acceso/acceso.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';

/*

    Para los roles usar:

        data: { roles: ['normal'] }

        data: { roles: ['normal', 'admin'] }

*/

export const routes: Routes = [
    {path:'', redirectTo: 'login', pathMatch: 'full'},
    {path:'home/:idOrganizacion', component: HomeComponent, canActivate: [AuthGuard]},
    {path:'planos_old', component: PlanoOldComponent, canActivate: [AuthGuard, AdminGuard]},
    {path:'plano_view/:idPlano/:idProyecto', component: PlanoViewComponent, canActivate: [AuthGuard]},
    {path:'plano_create/:idProyecto', component: PlanoCreateComponent, canActivate: [AuthGuard]},
    //{path:'plano_mod/:idPlano', component: PlanoModComponent, canActivate: [AuthGuard]},
    {path:'proyecto/:idProyecto', component: ProyectoComponent, canActivate: [AuthGuard]},
    {path:'mis_recortes', component: RecortesComponent, canActivate: [AuthGuard]},
    {path:'login', component: LoginComponent},
    {path:'pueba_roles', component: PruebaRolesComponent},

    {path:'acceso', component: AccesoComponent, canActivate: [AuthGuard]},

    {path:'admin_users', component: AdminUsersComponent, canActivate: [AuthGuard, AdminGuard]},

    {path: '**', redirectTo: 'login', pathMatch: 'full'}
];