/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { catchError } from 'rxjs';
import { parse, format } from 'date-fns';

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
  employee!: any;
  employeeAdd!: any;
  certificationName: string = '';
  departmentName: string = '';
  errorMessage: string = "";
  /**
   * Inject các service cần thiết
   * @param router Router
   */
  constructor(private router: Router, private employeeService: EmployeeService) { }
  /**
   * Gán giá trị cho các biến và xử lý các logic ban đầu khi
   * component render lần đầu
   */
  ngOnInit(): void {

    this.employee = history.state.data;
    this.departmentName = history.state.departmentName;
    this.certificationName = history.state.certificationName;

    if (JSON.parse(localStorage.getItem("employeeConfirm") || 'null')) {
      this.employee = JSON.parse(localStorage.getItem("employeeConfirm") || 'null').data;
      this.departmentName = JSON.parse(localStorage.getItem("employeeConfirm") || 'null').departmentName;
      this.certificationName = JSON.parse(localStorage.getItem("employeeConfirm") || 'null').certificationName;
    }
    this.employeeAdd = this.employee;


    this.employeeAdd.employeeBirthDate = this.parsDate(this.employeeAdd.employeeBirthDate + "");
    //Xử lý nếu ko có certification nào
    if (this.employeeAdd.certifications.length > 0) {
      if (this.employeeAdd.certifications[0].certificationId) {
        this.employeeAdd.certifications[0].certificationStartDate = this.parsDate(this.employeeAdd.certifications[0].certificationStartDate + "")
        this.employeeAdd.certifications[0].certificationEndDate = this.parsDate(this.employeeAdd.certifications[0].certificationEndDate + "")

      }

      if (!this.employeeAdd.certifications[0].certificationId) {
        this.employeeAdd.certifications = [];

      }
    } else {
      this.employeeAdd.certifications = [];
    }
  
  }
  /**
   * Chuyển về mà EditAdd với data đã được nhận từ màn EditAdd
   */
  navigateToEditAdd() {
    //Trường hợp có id trong router thì chuyển về trang edit
    if (this.employeeAdd.employeeId) {
      this.router.navigate(['/user/edit'], {
        state: {
          employeeIdEditConfirm: this.employeeAdd.employeeId,
          employee: this.employee,
          departmentName: this.departmentName,
          certificationName: this.certificationName,
        },
      });

    } else {
      //Trường hợp ko có id trong router thì chuyển về trang add
      this.router.navigate(['/user/add'], {
        state: {
          employee: this.employee,
          departmentName: this.departmentName,
          certificationName: this.certificationName,
        },
      });

    }

  }
  /**
   * Xử lý việc sự kiện button Ok
   * Thực hiện add 1 employee hoặc edit 1 employee
   */
  addEmployee() {

    //Kiểm tra router có employeeId không.
    if (this.employeeAdd.employeeId) {
      this.employeeService.editEmployee(this.employeeAdd).pipe(
        //Xử lý lỗi
        catchError((err) => {
          if (err.message.code == 'ER013') {
            this.router.navigate(['/systemerror'], {
              state: { message: '該当するユーザは存在していません。' },
            });
          }
          if (err.message.code == 'ER003') {
            this.router.navigate(['/systemerror'], {
              state: { message: 'アカウント名 は既に存在しています。' },
            });
          }

          throw new Error("Có lỗi rồi !")
        })
      ).subscribe(data => {
    
        localStorage.removeItem("employeeConfirm")
        localStorage.removeItem("employeeConfirmErr")
        this.router.navigate(['/user/complete'], { state: { message: "ユーザの更新が完了しました。" } })
      })
    } else {
      this.employeeService.addEmployee(this.employeeAdd).pipe(
        //Xử lý lỗi
        catchError(() => {

          localStorage.setItem("employeeConfirmErr", JSON.stringify({
            data: this.employee,
            certificationName: this.certificationName,
            departmentName: this.departmentName,
          }));
          throw new Error("Có lỗi rồi !")
        })
      ).subscribe(data => {
        localStorage.removeItem("employeeConfirm")
        localStorage.removeItem("employeeConfirmErr")
        this.router.navigate(['/user/complete'], { state: { message: "ユーザの登録が完了しました。" } })
      })
    }
  }
  /**
   * Chuyển đổi thành chuỗi định dạng mới "yyyy/MM/dd"
   */
  parsDate(input: string): string {
    const inputDate = new Date(input);
    // Chuyển đổi thành chuỗi định dạng mới "yyyy/MM/dd"
    let formattedDate = format(inputDate, 'yyyy/MM/dd');
    return formattedDate;
  }
}
