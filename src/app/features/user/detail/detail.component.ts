/**
 * Copyright(C) 2023 Luvina Software Company
 * DetailComponent.ts, August 3, 2023 Toannq
 */
import { Certification } from './../../../models/Certification';
import { EmployeeService } from 'src/app/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EmployeeResponse } from 'src/app/models/EmployeeResponse';
import { th } from 'date-fns/locale';

/**
 * Component view chi tiết nhân viên
 * @author Toannq
 */
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  employee!: EmployeeResponse;
  certifications!: Certification[];


  /**
   * Thực hiện inject các service cần thiết
   * @param route route
   * @param router router
   * @param employeeService employeeService
   */
  constructor(private route: ActivatedRoute, private router: Router, private employeeService: EmployeeService) {

  }
  /**
   * Xử lý các logic khi component render lần đầu
   */
  ngOnInit(): void {
    //Kiểm tra xem trong router có employeeId không
    if (history.state.employeeId) {
      let id;
      //chuyển về kiểu number
      id = parseInt(history.state.employeeId || "null");
      //Kiểm tra xem id có phải number không
      if (id) {
        this.employeeService.getEmployeeById(id).subscribe(emp => {
          this.employee = emp;
        });

      } else {
        //chuyển về trang systemerror nếu xảy ra lỗi
        this.router.navigate(["/systemerror"], { state: { message: "該当するユーザは存在していません。" } })
      }


    } else {
      //Trường hợp F5
      this.router.navigate(["/systemerror"], { state: { message: "該当するユーザは存在していません。" } })

    }

    this.employeeService.getCertification().subscribe(data => this.certifications = data.certifications)

  }
  /**
   * Xử lý get certificationName theo certificationId
   * @param id id của certification
   * @returns certificationName tìm được
   */
  getCertificationById(id: any): string {
    let certification: Certification | undefined;
    certification = this.certifications.find(cer => cer.certificationId == id);


    if (certification) {
      return certification.certificationName;
    } else {
      return "";
    }

  }
  /**
   * Xử lý việc chuyển về trang user/list bằng router
   */
  navigateToListUser() {
    //Get thông tin về thứ tự sort,giá trị tìm kiếm employeeName,departmentId từ localStorage
    const employeeState = JSON.parse(localStorage.getItem("employeeListState") || "null");
    //Kiểm tra xem employeeState có null hay không
    if (employeeState) {
      //Thực hiện navigate sang trang user/list kèm theo data của employeeState
      this.router.navigate(['/user/list'], {
        state: {
          currentPage: employeeState.currentPage,
          departmentId: employeeState.departmentId,
          employeeName: employeeState.employeeName,
          itemsPerPage: employeeState.itemsPerPage,
          sortByCertiName: employeeState.sortByCertiName,
          sortByEndDate: employeeState.sortByEndDate,
          sortByName: employeeState.sortByName,
        }
      })

    }
    else {
      this.router.navigate(['/user/list'])
    }
    //Xoá item employeeListState ở localStorage
    localStorage.removeItem("employeeListState");

  }
  deleteUser(employeeId: number) {

    let result = window.confirm("削除しますが、よろしいでしょうか。");

    if (result) {

      this.employeeService.deleteEmployeeById(employeeId).subscribe(
        (response) => {
          this.router.navigate(['/user/complete'], { state: { message: "ユーザの削除が完了しました。" } })
        }
      )

    }


  }

}
