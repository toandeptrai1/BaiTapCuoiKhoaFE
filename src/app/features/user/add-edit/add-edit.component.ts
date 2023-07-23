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
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { EmployeeAdd } from 'src/app/models/EmployeeAdd';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { CertificationValidator } from 'src/app/validators/certificationDatevalidator';

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
  certificationList: Certification[] = [];
  addForm!: FormGroup;
  certificationName: string = '';
  departmentName: string = '';
  submitted: boolean = false;
  isSelectedCerti: boolean = false;
  errMessage:string="";

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
  ) { }
  get certifications(): FormArray {
    return this.addForm.get('certifications') as FormArray;
  }
  /**
   * Xử lý gán các giá trị hoặc xử lý các logic
   * khi component lần đầu được render
   */
  ngOnInit(): void {
    //Kiểm tra xem có lỗi api không
    if(history.state.message){
      this.errMessage=history.state.message;
    }
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
      .subscribe((data) => (this.certificationList = data.certifications));
    this.addForm = this.fb.group(
      {
        employeeName: new FormControl('', [
          Validators.required,
          Validators.maxLength(125),
        ]),
        employeeEmail: new FormControl('', [
          Validators.required,
          Validators.maxLength(125),
          Validators.email,
        ]),
        employeeLoginId: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[a-zA-Z_][a-zA-Z0-9_]*$/),
        ]),
        employeeTelephone: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('[a-zA-Z0-9!-/:-@\\[-`{-~]+'),
        ]),
        employeeBirthDate: new FormControl('', Validators.required),
        employeeNameKana: new FormControl('', [
          Validators.required,
          Validators.maxLength(125),
          Validators.pattern('[ぁ-んァ-ン一-龯々〆〤ー・｜｡-ﾟ]+'),
        ]),
        departmentId: new FormControl('', Validators.required),
        employeeLoginPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ]),
        employeeConfirmPassword: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
          PasswordValidator
        ]),
        certifications: this.fb.array([
          this.fb.group({
            certificationId: new FormControl(''),
            certificationStartDate: new FormControl(''),
            certificationEndDate: new FormControl(''),
            employeeCertificationScore: new FormControl(''),
          }),
        ]),
      }

    );
    //disable các trường certificationStartDate,EndDate,Score
    this.addForm.controls['certifications']
      ?.get(0 + '')
      ?.get('certificationStartDate')
      ?.disable();
    this.addForm.controls['certifications']
      ?.get(0 + '')
      ?.get('certificationEndDate')
      ?.disable();
    this.addForm.controls['certifications']
      ?.get(0 + '')
      ?.get('employeeCertificationScore')
      ?.disable();
    /**
     * Gán lại giá trị được truyền từ màn confirm
     * cho form trong trường hợp back từ màn hình confirm về
     */
    console.log(history.state)
    if (history.state.employee) {

      this.isSelectedCerti = true;
      //gán giá trị được lấy từ router trả về
      let employee: EmployeeAdd = history.state.employee;
      this.departmentName = history.state.departmentName;

      //gán giá trị được lấy từ router trả về
      this.certificationName = history.state.certificationName;
      this.addForm.get("employeeName")?.setValue(employee.employeeName);
      this.addForm.get("employeeEmail")?.setValue(employee.employeeEmail);
      this.addForm.get("employeeLoginId")?.setValue(employee.employeeLoginId);
      this.addForm.get("employeeBirthDate")?.setValue(employee.employeeBirthDate);
      this.addForm.get("departmentId")?.setValue(employee.departmentId);
      this.addForm.get("employeeTelephone")?.setValue(employee.employeeTelephone);
      this.addForm.get("employeeNameKana")?.setValue(employee.employeeNameKana);
      this.addForm.get("employeeLoginPassword")?.setValue(employee.employeeLoginPassword);
      this.addForm.get("employeeConfirmPassword")?.setValue(employee.employeeLoginPassword);
      const certificationForm = this.certifications.at(0) as FormGroup;
      if (this.certificationName) {
        certificationForm.get("certificationId")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationId : '')
        certificationForm.get("certificationStartDate")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationStartDate : '')
        certificationForm.get("certificationEndDate")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationEndDate : '')
        certificationForm.get("employeeCertificationScore")?.patchValue(employee.certifications[0] ? employee.certifications[0].employeeCertificationScore : '')
        certificationForm.get("certificationStartDate")?.setValidators([Validators.required])
        certificationForm.get("certificationEndDate")?.setValidators([Validators.required, CertificationValidator])
        certificationForm.get("employeeCertificationScore")?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')])
        this.addForm.controls['certifications']
          ?.get(0 + '')
          ?.get('certificationStartDate')
          ?.enable();
        this.addForm.controls['certifications']
          ?.get(0 + '')
          ?.get('certificationEndDate')
          ?.enable();
        this.addForm.controls['certifications']
          ?.get(0 + '')
          ?.get('employeeCertificationScore')
          ?.enable();

      }
      if (!this.certificationName) {
        certificationForm.get("certificationId")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationId : '')
        certificationForm.get("certificationStartDate")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationStartDate : '')
        certificationForm.get("certificationEndDate")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationEndDate : '')
        certificationForm.get("employeeCertificationScore")?.patchValue(employee.certifications[0] ? employee.certifications[0].employeeCertificationScore : '')


        this.isSelectedCerti = false;
        this.addForm.controls['certifications']
          ?.get(0 + '')
          ?.get('certificationStartDate')
          ?.disable();
        this.addForm.controls['certifications']
          ?.get(0 + '')
          ?.get('certificationEndDate')
          ?.disable();
        this.addForm.controls['certifications']
          ?.get(0 + '')
          ?.get('employeeCertificationScore')
          ?.disable();
      }
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
    let employeeAdd: EmployeeAdd = this.addForm.value;
    const certificationsForm = this.addForm.get("certifications") as FormArray;

    if (id) {
      //Set lại biến kiểm tra chọn certificaton dropdown hay không
      this.isSelectedCerti = true;
      let certi = this.certificationList.find((x) => x.certificationId == id);
      let employee: EmployeeAdd = history.state.employee;
      //thêm validator cho certificationStartDate,EndDate,Score nếu chọn tiếng Nhật
      this.certificationName = certi?.certificationName ? certi.certificationName : '';
      certificationsForm.clear();
      const certificationFormGroup = this.fb.group({
        certificationId: new FormControl(id),
        certificationStartDate: new FormControl(
          employeeAdd.certifications[0].certificationStartDate,
          Validators.required
        ),
        certificationEndDate: new FormControl(
          employeeAdd.certifications[0].certificationEndDate,
          [Validators.required, CertificationValidator]
        ),
        employeeCertificationScore: new FormControl(
          employeeAdd.certifications[0].employeeCertificationScore,
          [Validators.required, Validators.pattern('^[0-9]+$')]
        ),
      });
      certificationsForm.push(certificationFormGroup)
      //enable các trường certificationStartDate,EndDate,Score
      this.addForm.controls['certifications']
        ?.get(0 + '')
        ?.get('certificationStartDate')
        ?.enable();
      this.addForm.controls['certifications']
        ?.get(0 + '')
        ?.get('certificationEndDate')
        ?.enable();
      this.addForm.controls['certifications']
        ?.get(0 + '')
        ?.get('employeeCertificationScore')
        ?.enable();
    } else {
      this.certificationName = '';
      //Set lại biến kiểm tra chọn certificaton dropdown hay không
      this.isSelectedCerti = false;
      //Set lại form nếu bỏ phần Validator của certificationStartDate,EndDate,Score


      const certificationFormGroup = this.fb.group({
        certificationId: new FormControl(''),
        certificationStartDate: new FormControl(''),
        certificationEndDate: new FormControl(''),
        employeeCertificationScore: new FormControl(''),
      });
      certificationsForm.clear();
      certificationsForm.push(certificationFormGroup);

      //disable các trường certificationStartDate,EndDate,Score
      this.addForm.controls['certifications']
        ?.get(0 + '')
        ?.get('certificationStartDate')
        ?.disable();
      this.addForm.controls['certifications']
        ?.get(0 + '')
        ?.get('certificationEndDate')
        ?.disable();
      this.addForm.controls['certifications']
        ?.get(0 + '')
        ?.get('employeeCertificationScore')
        ?.disable();
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
