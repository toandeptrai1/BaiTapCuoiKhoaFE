/**
 * Copyright(C) 2023 Luvina Software Company
 * DetailComponent.ts, August 3, 2023 Toannq
 */
import { Certification } from './../../../models/Certification';
import { EmployeeService } from 'src/app/services/employee.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EmployeeResponse } from 'src/app/models/EmployeeResponse';
import { catchError } from 'rxjs';
import { TokenUtils } from 'src/app/shared/utils/token.utils';

/**
 * Component view chi tiết nhân viên
 * @author Toannq
 */
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
})
export class DetailComponent implements OnInit {
  employee!: EmployeeResponse;
  certifications!: Certification[];
  errorMessage: string = '';
  certificationName:String=""

  /**
   * Thực hiện inject các service cần thiết
   * @param route route
   * @param router router
   * @param employeeService employeeService
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
   
  ) { }
  /**
   * Xử lý các logic khi component render lần đầu
   */
  ngOnInit(): void {
    //Kiểm tra xem trong router có employeeId không
    if (history.state.employeeId) {
      let id;
      //chuyển về kiểu number
      id = parseInt(history.state.employeeId || 'null');
      //Kiểm tra xem id có phải number không
      if (id) {
        this.employeeService.getEmployeeById(id).pipe(
          catchError((err) => {
            this.errorMessage = '該当するユーザは存在していません。';
            throw new Error("lỗi rồi");
          })
        ).subscribe(
          (emp) => {
            this.employee = emp;
           
          }
        );
      } else {
        //chuyển về trang systemerror nếu xảy ra lỗi
        this.router.navigate(['/systemerror'], {
          state: { message: '該当するユーザは存在していません。' },
        });
      }
    } else {
      //Trường hợp F5
      this.router.navigate(['/systemerror'], {
        state: { message: '該当するユーザは存在していません。' },
      });
    }

    this.employeeService
      .getCertification()
      .subscribe((data) => {
        this.certifications = data.certifications;
        this.certificationName=this.getCertificationById(this.employee.certifications[0].certificationId);
      });
  }
  /**
   * Xử lý get certificationName theo certificationId
   * @param id id của certification
   * @returns certificationName tìm được
   */
  getCertificationById(id: any): string {
    if (id) {
      let certification: Certification | undefined;
      certification = this.certifications.find(
        (cer) => cer.certificationId === id
      );

      if (certification) {
        return certification.certificationName;
      } else {
        return '';
      }
    }
    return "";
  }
  /**
   * Xử lý việc chuyển về trang user/list bằng router
   */
  navigateToListUser() {
    //Get thông tin về thứ tự sort,giá trị tìm kiếm employeeName,departmentId từ localStorage
    const employeeState = JSON.parse(
      localStorage.getItem('employeeListState') || 'null'
    );
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
        },
      });
    } else {
      this.router.navigate(['/user/list']);
    }
    //Xoá item employeeListState ở localStorage
    localStorage.removeItem('employeeListState');
  }
  /**
   * Xử lý sự kiện click button [削除] và thực hiện gọi phương thức xoá employee
   * @param employeeId employeeId cần xoá
   */
  deleteUser(employeeId: number) {
    //show hộp confirm xác nhận xoá
    let result = window.confirm('削除しますが、よろしいでしょうか。');
    //Kiểm tra xem người dùng có click button ok ở hộp confirm không
    if (result) {
      const token = sessionStorage.getItem('access_token');
      if (token) {
        const payload = TokenUtils.parseJwt(token);
        //Thực hiện kiểm tra xem id cần xoá có phải là tài khoản đang đăng nhập
        if (employeeId === payload.employee.employeeId) {
          this.errorMessage ='管理者ユーザを削除することはできません。';
        } else {
          //Thực hiện gọi api xoá employee theo id
          this.employeeService
            .deleteEmployeeById(employeeId)
            .pipe(
              catchError((err) => {
                if (err.message.code == 'ER014') {
                  this.errorMessage = '該当するユーザは存在していません。';
                } else {
                  this.errorMessage = 'ID を入力してください';
                }
                window.scrollTo({ top: 0 });
                throw new Error('loi roi');
              })
            )
            .subscribe((response) => {
              //Chuyển sang trang complete với message
              this.router.navigate(['user/complete'], {
                state: { message: 'ユーザの削除が完了しました。' },
              });
            });
        }
      }
    }
  }
  /**
   * Xử lý việc navigate sang trang edit kèm theo employeeId
   * @param employeeId
   */
  updateUser(employeeId: any) {
    this.router.navigate(['user/edit'], { state: { employeeIdEdit: employeeId } })

  }
}
