import { Router } from '@angular/router';
import { EmployeeAdd } from './../../../models/EmployeeAdd';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
export class ConfirmComponent implements OnInit {
  employee!: EmployeeAdd;
  certificationName: string = '';
  departmentName: string = '';
  constructor(private router: Router) {}
  ngOnInit(): void {
    console.log(history.state);
    this.employee = history.state.data;
    this.departmentName = history.state.departmentName;
    this.certificationName = history.state.certificationName;
  }
  navigateToEditAdd() {
    this.router.navigate(['/user/add'], { state: { employee: this.employee ,departmentName:this.departmentName,certificationName:this.certificationName} });
  }
}
