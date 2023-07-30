import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './list/user-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AddEditComponent } from './add-edit/add-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfirmComponent } from './confirm/confirm.component';
import { CompleteComponent } from './complete/complete.component';
import { DetailComponent } from './detail/detail.component';

@NgModule({
  declarations: [UserListComponent, AddEditComponent, ConfirmComponent, CompleteComponent, DetailComponent],
  imports: [
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    CommonModule,
    SharedModule,
    UsersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}
