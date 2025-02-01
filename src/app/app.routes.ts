import { Routes } from '@angular/router';
import { PlanoComponent as PlanoOldComponent } from './plano_old/plano.component';
import { PlanoViewComponent } from './plano/plano-view/plano-view.component';
import { PlanoCreateComponent } from './plano/plano-create/plano-create.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProyectoComponent } from './proyecto/proyecto-view/proyecto.component';
import { PruebaRolesComponent } from './prueba-roles/prueba-roles.component';
import { RecortesComponent } from './recortes/recortes.component';
import { ProyectoCreateComponent } from './proyecto/proyecto-create/proyecto-create.component';
import { CrearOrganizacionComponent } from './crear-organizacion/crear-organizacion.component';

import { AuthGuard } from '@auth0/auth0-angular';
import { PlanoModComponent } from './plano/plano-mod/plano-mod.component';
import { ProyectoModComponent } from './proyecto/proyecto-mod/proyecto-mod.component';

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
    {path:'proyecto/:idProyecto/:idOrganizacion', component: ProyectoComponent, canActivate: [AuthGuard]},

    {path:'modificar_proyecto/:idProyecto/:idOrganizacion', component: ProyectoModComponent, canActivate: [AuthGuard, AdminGuard]},

    {path:'crear_proyecto/:idOrganizacion', component: ProyectoCreateComponent, canActivate: [AuthGuard, AdminGuard]},

    {path:'mis_recortes/:idOrganizacion', component: RecortesComponent, canActivate: [AuthGuard]},
    {path:'login', component: LoginComponent},
    {path:'pueba_roles', component: PruebaRolesComponent},

    {path:'acceso', component: AccesoComponent, canActivate: [AuthGuard]},

    {path:'crear_organizacion', component: CrearOrganizacionComponent, canActivate: [AuthGuard, AdminGuard, CreatorGuard]}, // debe ser admin y creador

    {path:'admin_users/:idOrganizacion', component: AdminUsersComponent, canActivate: [AuthGuard, AdminGuard]},

    // añadir edicion general de usuarios para creators

    {path: '**', redirectTo: 'login', pathMatch: 'full'}
];