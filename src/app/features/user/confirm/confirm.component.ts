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
  certificationName:string="";
  departmentName:string="";
  constructor() {}
  ngOnInit(): void {
    console.log(history.state)
    this.employee = history.state.data;
    this.departmentName=history.state.departmentName;
    this.certificationName=history.state.certificationName;
  }
}
