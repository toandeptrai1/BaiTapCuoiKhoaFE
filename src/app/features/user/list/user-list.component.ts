import { Component } from '@angular/core';

import { ApiResponse } from 'src/app/models/apiResponse';
import { departments } from 'src/app/models/departments';
import { EmployeeService } from 'src/app/services/employee.service';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
  itemsPerPage: number = 4;
  sortByName: string = '';
  sortByCertiName: string = 'asc';
  sortByEndDate: string = 'asc';
  private orderBys: any[] = [
    { column: 'ord_employee_name', order: this.sortByName },
    { column: 'ord_certification_name', order: this.sortByCertiName },
    { column: 'ord_end_date', order: this.sortByEndDate },
  ];
  constructor(private employeeService: EmployeeService,private router: Router) {}
  ngOnInit(): void {
    this.employeeService
      .getEmployees(this.setUrlApi())
      .pipe(
        catchError((err:HttpErrorResponse) => {
          console.error(err);

          return []
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
    console.log(this.setUrlApi());
    this.currentPage = 1;
    this.employeeService
      .getEmployees(this.setUrlApi())
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
        console.log(data);
        this.totalPage = Math.ceil(this.data.totalRecords / this.itemsPerPage);
        console.log(this.totalPage);
      });
  }
  goToPage(page: number) {
    this.currentPage = page;
    this.employeeService
      .getEmployees(this.setUrlApi())
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
      });
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
    this.setValueForOrderBys();
    this.changeIndexsortByName();
    console.log(this.setUrlApi());
    console.log(this.orderBys);
    console.log(this.sortByName);
    this.employeeService
      .getEmployees(this.setUrlApi())
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
      });
  }
  setSortByCertiName() {
    if (this.sortByCertiName == 'asc') {
      this.sortByCertiName = 'desc';
    } else if (this.sortByCertiName == 'desc') {
      this.sortByCertiName = 'asc';
    } else {
      this.sortByCertiName = 'asc';
    }
    this.setValueForOrderBys();
    this.changeIndexsortByCertiName();
    console.log(this.setUrlApi());
    console.log(this.orderBys);
    this.employeeService
      .getEmployees(this.setUrlApi())
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
      });
  }
  setSortByEndDate() {
    if (this.sortByEndDate == 'asc') {
      this.sortByEndDate = 'desc';
    } else if (this.sortByEndDate == 'desc') {
      this.sortByEndDate = 'asc';
    } else {
      this.sortByEndDate = 'asc';
    }
    this.setValueForOrderBys();
    this.changeIndexSortByEndDate();

    console.log(this.setUrlApi());
    console.log(this.orderBys);
    this.employeeService
      .getEmployees(this.setUrlApi())
      .pipe(
        catchError(() => {
          throw new Error('Đã xảy ra lỗi');
        })
      )
      .subscribe((data) => {
        this.data = data;
      });
  }
  // Khi người dùng click vào button sắp xếp theo 'ord_end_date'
  changeIndexSortByEndDate() {
    const sortByColumn = 'ord_end_date';

    // Tìm vị trí của phần tử trong mảng
    const index = this.orderBys.findIndex(
      (item) => item.column === sortByColumn
    );

    if (index > -1) {
      // Nếu phần tử đầu tiên không phải là 'ord_employee_name'
      if (index !== 0 && this.orderBys[0].column !== 'ord_employee_name') {
        // Tìm vị trí của 'ord_employee_name' trong mảng
        const employeeNameIndex = this.orderBys.findIndex(
          (item) => item.column === 'ord_employee_name'
        );

        if (employeeNameIndex > -1) {
          // Di chuyển 'ord_employee_name' đến vị trí thứ 1 trong mảng
          this.orderBys.splice(
            0,
            0,
            this.orderBys.splice(employeeNameIndex, 1)[0]
          );
        }
      }

      // Đẩy phần tử lên đầu mảng
      this.orderBys.unshift(this.orderBys.splice(index, 1)[0]);
    }
  }

  // Tương tự cho các button sắp xếp khác
  changeIndexsortByName() {
    const sortByColumn = 'ord_employee_name';

    // Tìm vị trí của phần tử trong mảng
    const index = this.orderBys.findIndex(
      (item) => item.column === sortByColumn
    );

    if (index > -1) {
      // Nếu phần tử đầu tiên không phải là 'ord_employee_name'
      if (index !== 0 && this.orderBys[0].column !== 'ord_certification_name') {
        // Tìm vị trí của 'ord_employee_name' trong mảng
        const employeeNameIndex = this.orderBys.findIndex(
          (item) => item.column === 'ord_certification_name'
        );

        if (employeeNameIndex > -1) {
          // Di chuyển 'ord_employee_name' đến vị trí thứ 1 trong mảng
          this.orderBys.splice(
            0,
            0,
            this.orderBys.splice(employeeNameIndex, 1)[0]
          );
        }
      }

      // Đẩy phần tử lên đầu mảng
      this.orderBys.unshift(this.orderBys.splice(index, 1)[0]);
    }
  }

  changeIndexsortByCertiName() {
    const sortByColumn = 'ord_certification_name';

    // Tìm vị trí của phần tử trong mảng
    const index = this.orderBys.findIndex(
      (item) => item.column === sortByColumn
    );

    if (index > -1) {
      // Nếu phần tử đầu tiên không phải là 'ord_employee_name'
      if (index !== 0 && this.orderBys[0].column !== 'ord_employee_name') {
        // Tìm vị trí của 'ord_employee_name' trong mảng
        const employeeNameIndex = this.orderBys.findIndex(
          (item) => item.column === 'ord_employee_name'
        );

        if (employeeNameIndex > -1) {
          // Di chuyển 'ord_employee_name' đến vị trí thứ 1 trong mảng
          this.orderBys.splice(
            0,
            0,
            this.orderBys.splice(employeeNameIndex, 1)[0]
          );
        }
      }

      // Đẩy phần tử lên đầu mảng
      this.orderBys.unshift(this.orderBys.splice(index, 1)[0]);
    }
  }
  setValueForOrderBys() {
    this.orderBys.forEach((item) => {
      if (item.column === 'ord_employee_name') {
        item.order = this.sortByName;
      } else if (item.column === 'ord_certification_name') {
        item.order = this.sortByCertiName;
      } else if (item.column === 'ord_end_date') {
        item.order = this.sortByEndDate;
      }
    });
  }
  setUrlApi() {
    const baseUrl = `http://localhost:8085/employee?employee_name=${
      this.employeeName
    }&department_id=${this.departmentId}&offset=${this.currentPage - 1}&limit=${
      this.itemsPerPage
    }&`;
    const queryString = this.orderBys
      .filter((item) => item.order !== '' && item.order !== null)
      .map((item) => `${item.column}=${item.order}`)
      .join('&');

    let url = `${baseUrl}${queryString}`;
    if (url.endsWith('&')) {
      url = url.slice(0, -1);
    }
    return url;
  }
}
