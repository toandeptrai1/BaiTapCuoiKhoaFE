import { EmployeeService } from 'src/app/services/employee.service';

import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EmployeeResponse } from 'src/app/models/EmployeeResponse';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  employee!: EmployeeResponse;

  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) {

  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      if (params.get("id")) {
        let id;
        id = parseInt(params.get("id") || "null");
        if (id) {
          this.employeeService.getEmployeeById(id).subscribe(emp => {
            this.employee = emp;
            console.log(this.employee);
          });

        } else {
          console.log("loi roi")
        }


      }
    })

  }



}
