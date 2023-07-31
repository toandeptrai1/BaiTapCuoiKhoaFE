import { Certification } from './../../../models/Certification';
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
  certifications!:Certification[];
 

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
    this.employeeService.getCertification().subscribe(data=>this.certifications=data.certifications)

  }
  getCertificationById(id:any):string{
    let certification:Certification|undefined;
    certification=this.certifications.find(cer=>cer.certificationId==id);
    
    
    if(certification){
      return certification.certificationName;
    }else{
      return "";
    }
  
  }
  navigateToListUser(){
    const employeeState=JSON.parse(localStorage.getItem("employeeListState")||"null");
    if(employeeState){
      this.router.navigate(['/user/list'],{state:{
        currentPage: employeeState.currentPage,
        departmentId: employeeState.departmentId,
        employeeName: employeeState.employeeName,
        itemsPerPage: employeeState.itemsPerPage,
        sortByCertiName: employeeState.sortByCertiName,
        sortByEndDate: employeeState.sortByEndDate,
        sortByName: employeeState.sortByName,
      }})
    }
    else{
      this.router.navigate(['/user/list'])
    }
    localStorage.removeItem("employeeListState");
    
  }

}
