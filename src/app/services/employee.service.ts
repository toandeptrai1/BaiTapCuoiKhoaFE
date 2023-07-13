import { departments } from './../models/departments';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { DepartmentResponse } from '../models/DepartmentResponse';
import { CertificationsResponse } from '../models/CertificationsResponse';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  urlEmployee:string="http://localhost:8085/employee"
  urlDepartment:string="http://localhost:8085/department"
  urlCertification:string="http://localhost:8085/certification";
  constructor(private http:HttpClient) {

   }
  getEmployees(employeeName:string="",departmentId:string="",page:number=0,size:number=4,sortByName:string="",sortByCertiName:string="",sortByEndDate:string=""):Observable<ApiResponse>{

    return this.http.get<ApiResponse>(this.urlEmployee+`?employee_name=${employeeName}&department_id=${departmentId}&ord_employee_name=${sortByName}&ord_end_date=${sortByEndDate}&offset=${page}&limit=${size}&ord_certification_name=${sortByCertiName}`);
  }
  // getEmployees(url:string):Observable<ApiResponse>{

  //   return this.http.get<ApiResponse>(url);
  // }
  getDepartmentById(id:number){
    return this.http.get<departments>(`${this.urlDepartment}/${id}`)
  }
  getDepartments():Observable<DepartmentResponse>{
    return this.http.get<DepartmentResponse>(this.urlDepartment);
  }
  getCertification():Observable<CertificationsResponse>{
    return this.http.get<CertificationsResponse>(this.urlCertification);
  }

}
