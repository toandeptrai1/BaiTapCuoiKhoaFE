/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { Router } from '@angular/router';
import { EmployeeAdd } from './../../../models/EmployeeAdd';
import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { catchError } from 'rxjs';

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
  employeeAdd!:EmployeeAdd;
  certificationName: string = '';
  departmentName: string = '';
  errorMessage:string="";
  /**
   * Inject các service cần thiết
   * @param router Router
   */
  constructor(private router: Router, private employeeService: EmployeeService) {}
  /**
   * Gán giá trị cho các biến và xử lý các logic ban đầu khi
   * component render lần đầu
   */
  ngOnInit(): void {
    console.log(history.state);
    this.employee = history.state.data;
    this.departmentName = history.state.departmentName;
    this.certificationName = history.state.certificationName;
    this.employeeAdd=this.employee;
    //Xử lý nếu ko có certification nào
    if(this.employeeAdd.certifications.length>0){
      if(!this.employeeAdd.certifications[0].certificationId){
        this.employeeAdd.certifications=[];
        
      }
    }else{
      this.employeeAdd.certifications=[];
    }
    console.log("employ dung de add:");
    console.log(this.employeeAdd);
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
  /**
   * Xử lý việc sự kiện button Ok
   * Thực hiện add 1 employee
   */
  addEmployee(){
   this.employeeService.addEmployee(this.employeeAdd).pipe(
    //Xử lý lỗi
    catchError(()=>{
      this.errorMessage="Có lỗi rồi đại vương ơi!";
      throw new Error("Có lỗi rồi !")
    })
   ).subscribe(data=>{
    console.log("emplyee thêm được:")
    console.log(data);
    this.router.navigateByUrl("/user/complete")
   })
  }
}
