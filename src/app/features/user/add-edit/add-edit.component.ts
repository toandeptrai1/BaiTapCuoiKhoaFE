import { Certification } from './../../../models/Certification';
import { EmployeeService } from './../../../services/employee.service';
import { departments } from './../../../models/departments';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css']
})
export class AddEditComponent implements OnInit{
  birdDate=new Date();
  startDate=new Date();
  endDate=new Date();
  departments!: departments[];
  certifications:Certification[]=[];

  constructor(private employeeService:EmployeeService){

  }
  ngOnInit(): void {
    this.employeeService.getDepartments().subscribe((data) => {
      this.departments = data.departments;
    });
    this.employeeService.getCertification().subscribe(data=>this.certifications=data.certifications);

  }

}
