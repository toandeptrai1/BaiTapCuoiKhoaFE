/**
 * Copyright(C) 2023 Luvina Software Company
 * EmployeeService.ts, July 15, 2023 Toannq
 */
import { employees } from './../models/Employees';
import { EmployeeAdd } from './../models/EmployeeAdd';
import { departments } from './../models/departments';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable } from 'rxjs';
import { ApiResponse } from '../models/apiResponse';
import { DepartmentResponse } from '../models/DepartmentResponse';
import { CertificationsResponse } from '../models/CertificationsResponse';

/**
 * Class triển khai các phương thức call các api
 * get list Employee,add Employee,get Certifications,get Departments từ server về
 * @author Toannq
 */
@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  urlEmployee:string="http://localhost:8085/employee"
  urlDepartment:string="http://localhost:8085/department"
  urlCertification:string="http://localhost:8085/certification";
  /**
   * Khởi tạo các service cần thiê
   * @param http đối tượng hỗ trợ việc thực hiện việc call api 
   */
  constructor(private http:HttpClient) {

   }
  /**
   * Xử lý get danh sách employee theo các param được truyền vào
   * @param employeeName tên của employee
   * @param departmentId id phòng ban
   * @param page trang cần lấy
   * @param size số bản ghi trên trang
   * @param sortByName thứ tự sắp xếp của Employee Name
   * @param sortByCertiName thứ tự săp xếp của CertificationName
   * @param sortByEndDate thứ tự sáp xếp cảu EndDate
   * @returns ApiResponse đối tượng chứa danh sách Employee và tổng số bản ghi
   */
  getEmployees(employeeName:string="",departmentId:string="",page:number=0,size:number=4,sortByName:string="",sortByCertiName:string="",sortByEndDate:string=""):Observable<ApiResponse>{

    return this.http.get<ApiResponse>(this.urlEmployee+`?employee_name=${employeeName}&department_id=${departmentId}&ord_employee_name=${sortByName}&ord_end_date=${sortByEndDate}&offset=${page}&limit=${size}&ord_certification_name=${sortByCertiName}`);
  }
  // getEmployees(url:string):Observable<ApiResponse>{

  //   return this.http.get<ApiResponse>(url);
  // }
  getDepartmentById(id:number){
    return this.http.get<departments>(`${this.urlDepartment}/${id}`)
  }
  /**
   * Xử lý việc get danh sách department từ api được trả về từ server
   * @returns DepartmentResponse đối tượng chứa danh sach Departments
   */
  getDepartments():Observable<DepartmentResponse>{
    return this.http.get<DepartmentResponse>(this.urlDepartment);
  }
  /**
   * Xử lý việc lấy ra danh sách Certification từ  api được trả về từ server
   * @returns CertificationsResponse đối tượng chứa list Certification
   */
  getCertification():Observable<CertificationsResponse>{
    return this.http.get<CertificationsResponse>(this.urlCertification);
  }
  /**
   * Xử lý việc gọi api thêm mới 1 employee
   * @param employee dữ liệu employee cần add 
   * @returns api được server trả về
   */
  addEmployee(employee:EmployeeAdd):Observable<any>{
    return this.http.post<any>(this.urlEmployee+"/add",employee);

  }

}
