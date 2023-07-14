import { Component } from '@angular/core';

import { ApiResponse } from 'src/app/models/apiResponse';
import { departments } from 'src/app/models/departments';
import { EmployeeService } from 'src/app/services/employee.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent {
  data!: ApiResponse;
  departments!: departments[];
  employeeName: string = '';
  departmentId: string = '';
  totalPage: number = 1;
  currentPage: number = 1;
  itemsPerPage: number = 20;
  sortByName: string = 'asc';
  sortByCertiName: string = 'asc';
  sortByEndDate: string = 'asc';

  constructor(private employeeService: EmployeeService,private router: Router) {}
  ngOnInit(): void {
    this.employeeService.getEmployees(this.employeeName,this.departmentId,this.currentPage-1,this.itemsPerPage,this.sortByName,this.sortByCertiName,this.sortByEndDate).pipe(
      catchError(()=>{
        throw new Error("Đã xảy ra lỗi");
      })
    ).subscribe(data=>{
      this.data=data;
      this.totalPage=Math.ceil(data.totalRecords / this.itemsPerPage);
      console.log(this.totalPage);
    }
      );
    this.employeeService.getDepartments().subscribe((data) => {
      this.departments = data.departments;
    });
  }
  getDepartmentById(id: number) {
    let department;
    department = this.departments.find((d) => d.departmentId == id);
    return department;
  }
  handleChange(value: any) {
    this.departmentId = value + '';
  }
  handleInput(value: any) {
    this.employeeName = value;
  }
  onSearch() {
    this.currentPage = 1;
    this.employeeService.getEmployees(this.employeeName,this.departmentId,this.currentPage-1,this.itemsPerPage,this.sortByName,this.sortByCertiName,this.sortByEndDate).pipe(
      catchError(()=>{
        throw new Error("Đã xảy ra lỗi");
      })
    ).subscribe(data=>{
      this.data=data;
      this.totalPage=Math.ceil(data.totalRecords / this.itemsPerPage);
      console.log(this.totalPage);
    }
      );
  }
  goToPage(page: number) {
    this.currentPage = page;
    this.employeeService.getEmployees(this.employeeName,this.departmentId,this.currentPage-1,this.itemsPerPage,this.sortByName,this.sortByCertiName,this.sortByEndDate).pipe(
      catchError(()=>{
        throw new Error("Đã xảy ra lỗi");
      })
    ).subscribe(data=>{
      this.data=data;
      this.totalPage=Math.ceil(data.totalRecords / this.itemsPerPage);
      console.log(this.totalPage);
    }
      );
  }
  isOrderASC(ord: string) {
    return ord == 'asc';
  }
  isOrderDesc(ord: string) {
    return ord == 'desc';
  }
  setSortByName() {
    if (this.sortByName == 'asc') {
      this.sortByName = 'desc';
    } else if (this.sortByName == 'desc') {
      this.sortByName = 'asc';
    } else {
      this.sortByName = 'asc';
    }

    this.employeeService
    this.employeeService.getEmployees(this.employeeName,this.departmentId,this.currentPage-1,this.itemsPerPage,this.sortByName,this.sortByCertiName,this.sortByEndDate).pipe(
      catchError(()=>{
        throw new Error("Đã xảy ra lỗi");
      })
    ).subscribe(data=>{
      this.data=data;
      this.totalPage=Math.ceil(data.totalRecords / this.itemsPerPage);
      console.log(this.totalPage);
    }
      );
  }
  setSortByCertiName() {
    if (this.sortByCertiName == 'asc') {
      this.sortByCertiName = 'desc';
    } else if (this.sortByCertiName == 'desc') {
      this.sortByCertiName = 'asc';
    } else {
      this.sortByCertiName = 'asc';
    }

    this.employeeService.getEmployees(this.employeeName,this.departmentId,this.currentPage-1,this.itemsPerPage,this.sortByName,this.sortByCertiName,this.sortByEndDate).pipe(
      catchError(()=>{
        throw new Error("Đã xảy ra lỗi");
      })
    ).subscribe(data=>{
      this.data=data;
      this.totalPage=Math.ceil(data.totalRecords / this.itemsPerPage);
      console.log(this.totalPage);
    }
      );
  }
  setSortByEndDate() {
    if (this.sortByEndDate == 'asc') {
      this.sortByEndDate = 'desc';
    } else if (this.sortByEndDate == 'desc') {
      this.sortByEndDate = 'asc';
    } else {
      this.sortByEndDate = 'asc';
    }

    this.employeeService.getEmployees(this.employeeName,this.departmentId,this.currentPage-1,this.itemsPerPage,this.sortByName,this.sortByCertiName,this.sortByEndDate).pipe(
      catchError(()=>{
        throw new Error("Đã xảy ra lỗi");
      })
    ).subscribe(data=>{
      this.data=data;
      this.totalPage=Math.ceil(data.totalRecords / this.itemsPerPage);
      console.log(this.totalPage);
    }
      );
  }

}
