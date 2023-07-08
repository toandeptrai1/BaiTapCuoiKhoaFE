import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemErrorComponent } from 'src/app/shared/component/error/system-error.component';
import { UserListComponent } from './list/user-list.component';
import { AuthorizeGuard } from '../../shared/auth/authorize.guard';
import { AddEditComponent } from './add-edit/add-edit.component';


const routes: Routes = [
  { path: 'user', redirectTo: 'user/list', pathMatch: 'full'},
  { path: 'user/add', component: AddEditComponent, canActivate: [AuthorizeGuard] },
  { path: 'user/list', component: UserListComponent, canActivate: [AuthorizeGuard] },
  { path: 'systemerror', component: SystemErrorComponent },
  { path: '**', component: SystemErrorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
