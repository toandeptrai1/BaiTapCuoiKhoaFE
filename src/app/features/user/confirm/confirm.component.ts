/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { Router } from '@angular/router';
import { EmployeeAdd } from './../../../models/EmployeeAdd';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
})
/**
 * Xử lý các logic và khai báo các tham số cần thiết cho ConfirmComponent
 * @author Toannq
 */
export class ConfirmComponent implements OnInit {
  employee!: EmployeeAdd;
  certificationName: string = '';
  departmentName: string = '';
  /**
   * Inject các service cần thiết
   * @param router Router
   */
  constructor(private router: Router) {}
  /**
   * Gán giá trị cho các biến và xử lý các logic ban đầu khi
   * component render lần đầu
   */
  ngOnInit(): void {
    console.log(history.state);
    this.employee = history.state.data;
    this.departmentName = history.state.departmentName;
    this.certificationName = history.state.certificationName;
  }
  /**
   * Chuyển về mà EditAdd với data đã được nhận từ màn EditAdd
   */
  navigateToEditAdd() {
    this.router.navigate(['/user/add'], {
      state: {
        employee: this.employee,
        departmentName: this.departmentName,
        certificationName: this.certificationName,
      },
    });
  }
}
