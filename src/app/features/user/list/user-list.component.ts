/**
 * Copyright(C) 2023 Luvina Software Company
 * UserListComponent.ts, July 15, 2023 Toannq
 */
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
/**
 * Xử lý các logic và khai báo các tham số cần thiết cho UserListComponent
 * @author Toannq
 */
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
  /**
   * Inject các service cần thiết
   * @param employeeService employeeService
   * @param router router
   */
  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }
  /**
   * Gán các giá trị cho các thuộc tính và xử lý các logic ban đầu khi
   * componen render lần đâu.
   */
  ngOnInit(): void {
    console.log(history.state.employeeName)
    //Kiểm tra xem có data trong router không trong trường hợp navigate từ màn complate về
    if(history.state.employeeName){
      this.employeeName=history.state.employeeName;
      this.departmentId=history.state.departmentId;
      this.sortByName=history.state.sortByName;
      this.currentPage=history.state.currentPage;
      this.sortByCertiName=history.state.sortByCertiName;
      this.sortByEndDate=history.state.sortByEndDate;

    }
    //Thực hiện gọi api hiển thị danh sách employee lần đầu
    this.employeeService
      .getEmployees(
        this.employeeName,
        this.departmentId,
        this.currentPage - 1,
        this.itemsPerPage,
        this.sortByName,
        this.sortByCertiName,
        this.sortByEndDate
      )
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.totalPage = Math.ceil(data.totalRecords / this.itemsPerPage);
        console.log(this.totalPage);
      });
    this.employeeService.getDepartments().subscribe((data) => {
      this.departments = data.departments;
    });
  }
  /**
   * Gán lại giá trị cho departmentId
   * @param value giá trị của departmentID
   */
  handleChange(value: any) {
    this.departmentId = value + '';
  }
 
  /**
   * Xử lý sự kiện button search
   */
  onSearch(value:any) {
    this.currentPage = 1;
    this.employeeName = value;
    this.employeeService
      .getEmployees(
        this.employeeName,
        this.departmentId,
        this.currentPage - 1,
        this.itemsPerPage,
        this.sortByName,
        this.sortByCertiName,
        this.sortByEndDate
      )
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.totalPage = Math.ceil(data.totalRecords / this.itemsPerPage);
        console.log(this.totalPage);
      });
  }
  /**
   * Xử lý sự kiện người dùng click 1 page number
   * ở vùng paging trên giao diện
   * @param page page number
   */
  goToPage(page: number) {
    this.currentPage = page;
    this.employeeService
      .getEmployees(
        this.employeeName,
        this.departmentId,
        this.currentPage - 1,
        this.itemsPerPage,
        this.sortByName,
        this.sortByCertiName,
        this.sortByEndDate
      )
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.totalPage = Math.ceil(data.totalRecords / this.itemsPerPage);
        console.log(this.totalPage);
      });
  }
  /**
   *
   * @param ord thứ tự sắp xếp
   * @returns thứ tự sắp xếp
   */
  isOrderASC(ord: string) {
    return ord == 'asc';
  }
  /**
   *
   * @param ord thứ tự sắp xếp
   * @returns thứ tự sắp xếp
   */
  isOrderDesc(ord: string) {
    return ord == 'desc';
  }
  /**
   * gán lại thứ tự sắp xếp của sortByName
   * và gọi api sắp xếp
   */
  setSortByName() {
    if (this.sortByName == 'asc') {
      this.sortByName = 'desc';
    } else if (this.sortByName == 'desc') {
      this.sortByName = 'asc';
    } else {
      this.sortByName = 'asc';
    }

    this.employeeService;
    this.employeeService
      .getEmployees(
        this.employeeName,
        this.departmentId,
        this.currentPage - 1,
        this.itemsPerPage,
        this.sortByName,
        this.sortByCertiName,
        this.sortByEndDate
      )
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.totalPage = Math.ceil(data.totalRecords / this.itemsPerPage);
        console.log(this.totalPage);
      });
  }
  /**
   * gán lại thứ tự sắp xếp của SortByCertiName
   * và gọi api sắp xếp
   */
  setSortByCertiName() {
    if (this.sortByCertiName == 'asc') {
      this.sortByCertiName = 'desc';
    } else if (this.sortByCertiName == 'desc') {
      this.sortByCertiName = 'asc';
    } else {
      this.sortByCertiName = 'asc';
    }

    this.employeeService
      .getEmployees(
        this.employeeName,
        this.departmentId,
        this.currentPage - 1,
        this.itemsPerPage,
        this.sortByName,
        this.sortByCertiName,
        this.sortByEndDate
      )
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.totalPage = Math.ceil(data.totalRecords / this.itemsPerPage);
        console.log(this.totalPage);
      });
  }
  /**
   * gán lại thứ tự sắp xếp của SortByEndDate
   * và gọi api sắp xếp
   */
  setSortByEndDate() {
    if (this.sortByEndDate == 'asc') {
      this.sortByEndDate = 'desc';
    } else if (this.sortByEndDate == 'desc') {
      this.sortByEndDate = 'asc';
    } else {
      this.sortByEndDate = 'asc';
    }

    this.employeeService
      .getEmployees(
        this.employeeName,
        this.departmentId,
        this.currentPage - 1,
        this.itemsPerPage,
        this.sortByName,
        this.sortByCertiName,
        this.sortByEndDate
      )
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
        this.totalPage = Math.ceil(data.totalRecords / this.itemsPerPage);
        console.log(this.totalPage);
      });
  }
  /**
   * Xử lý navigate sang trang AddEdit
   */
  navigateToAddEdit(){
    localStorage.setItem("employeeListState",JSON.stringify({
      employeeName:this.employeeName,
      departmentId: this.departmentId,
      currentPage:this.currentPage,
      itemsPerPage: this.itemsPerPage,
      sortByName: this.sortByName,
      sortByCertiName:this.sortByCertiName,
      sortByEndDate:this.sortByEndDate
    }))
    this.router.navigateByUrl("/user/add")
  }
  navigateToDetail(employeeId:any){
    localStorage.setItem("employeeListState",JSON.stringify({
      employeeName:this.employeeName,
      departmentId: this.departmentId,
      currentPage:this.currentPage,
      itemsPerPage: this.itemsPerPage,
      sortByName: this.sortByName,
      sortByCertiName:this.sortByCertiName,
      sortByEndDate:this.sortByEndDate
    }))
    this.router.navigateByUrl("/user/detail/"+employeeId);

  }
}
