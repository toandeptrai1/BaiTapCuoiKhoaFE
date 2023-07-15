/**
 * Copyright(C) 2023 Luvina Software Company
 * AddEditComponent.ts, July 15, 2023 Toannq
 */
import { Router } from '@angular/router';
import { Certification } from './../../../models/Certification';
import { EmployeeService } from './../../../services/employee.service';
import { departments } from './../../../models/departments';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeAdd } from 'src/app/models/EmployeeAdd';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
/**
 * Xử lý các logic và khai báo các tham số cần thiết cho 
 * AddEditComponet
 * @author Toannq
 * 
 */
export class AddEditComponent implements OnInit {
  bsConfig!: Partial<BsDatepickerConfig>;
  birdDate = new Date();
  startDate = new Date();
  endDate = new Date();
  departments!: departments[];
  certifications: Certification[] = [];
  addForm!: FormGroup;
  certificationName: string = '';
  departmentName: string = '';
  submitted: boolean = false;
  /**
   * Xử lý inject các service cần thiết
   * @param employeeService service employeeService
   * @param fb FormBuilder
   * @param router Router
   */
  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private router: Router
  ) {

  }
  /**
   * Xử lý gán các giá trị hoặc xử lý các logic 
   * khi component lần đầu được render
   */
  ngOnInit(): void {
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD',
    };
    this.employeeService.getDepartments().subscribe((data) => {
      this.departments = data.departments;
    });
    /**
     * Khởi tạo các form và các trường của form
     */
    this.employeeService
      .getCertification()
      .subscribe((data) => (this.certifications = data.certifications));
    this.addForm = this.fb.group({
      employeeName: new FormControl('', Validators.required),
      employeeEmail: new FormControl('', Validators.required),
      employeeLoginId: new FormControl('', Validators.required),
      employeeTelephone: new FormControl('', Validators.required),
      employeeBirthDate: new FormControl('', Validators.required),
      employeeNameKana: new FormControl('', Validators.required),
      departmentId: new FormControl('', Validators.required),
      employeeLoginPassword: new FormControl('', Validators.required),
      employeeConfirmPassword: new FormControl('', Validators.required),
      certifications: this.fb.group({
        certificationId: new FormControl('', Validators.required),
        certificationStartDate: new FormControl('', Validators.required),
        certificationEndDate: new FormControl('', Validators.required),
        employeeCertificationScore: new FormControl('', Validators.required),
      }),
    });
    /**
     * Gán lại giá trị được truyền từ màn confirm
     * cho form trong trường hợp back từ màn hình confirm về
     */
    if (history.state.employee) {
      let employee: EmployeeAdd = history.state.employee;
      this.departmentName=history.state.departmentName;
      this.certificationName=history.state.certificationName;
      this.addForm = this.fb.group({
        employeeName: new FormControl(
          employee.employeeName,
          Validators.required
        ),
        employeeEmail: new FormControl(
          employee.employeeEmail,
          Validators.required
        ),
        employeeLoginId: new FormControl(
          employee.employeeLoginId,
          Validators.required
        ),
        employeeTelephone: new FormControl(
          employee.employeeTelephone,
          Validators.required
        ),
        employeeBirthDate: new FormControl(
          employee.employeeBirthDate,
          Validators.required
        ),
        employeeNameKana: new FormControl(
          employee.employeeNameKana,
          Validators.required
        ),
        departmentId: new FormControl(
          employee.departmentId,
          Validators.required
        ),
        employeeLoginPassword: new FormControl(
          employee.employeeLoginPassword,
          Validators.required
        ),
        employeeConfirmPassword: new FormControl(
          employee.employeeLoginPassword,
          Validators.required
        ),
        certifications: this.fb.group({
          certificationId: new FormControl(
            employee.certifications.certificationId,
            Validators.required
          ),
          certificationStartDate: new FormControl(
            employee.certifications.certificationEndDate,
            Validators.required
          ),
          certificationEndDate: new FormControl(
            employee.certifications.certificationEndDate,
            Validators.required
          ),
          employeeCertificationScore: new FormControl(
            employee.certifications.employeeCertificationScore,
            Validators.required
          ),
        }),
      });
    }
  }
  /**
   * Xử lý vệc navigate sang màn hình confirm với data được lấy 
   * được từ giá trị mà người dùng nhập
   */
  navigateToConfirm() {
    this.submitted = true;
    if (this.addForm.valid) {
      this.router.navigate(['/user/confirm'], {
        state: {
          data: this.addForm.value,
          certificationName: this.certificationName,
          departmentName: this.departmentName,
        },
      });
    }
  }
  /**
   * Xử lý việc gán lại certificationName khi thay đổi 
   * lựa chọn ở dropdown certification ở giao diện
   * @param id certificationId 
   */
  handleCertichange(id: any) {
    let certi = this.certifications.find((x) => x.certificationId == id);
    if (certi) {
      this.certificationName = certi.certificationName;
    }
  }
  /**
   * Xử lý việc gán lại giá trị của departmentName khi thay 
   * đổi lựa chọn ở dropdown department ở giao diện
   * @param id departmentId
   */
  handleDepartChange(id: any) {
    let depart = this.departments.find((x) => x.departmentId == id);
    if (depart) {
      this.departmentName = depart.departmentName;
    }
  }
}
