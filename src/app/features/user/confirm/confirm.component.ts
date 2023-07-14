import { employees } from './../../../models/Employees';
import { EmployeeAdd } from './../../../models/EmployeeAdd';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  employee!: EmployeeAdd;
  constructor() {}
  ngOnInit(): void {
    this.employee = history.state.data;
  }
}
