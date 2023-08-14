
/**
 * Copyright(C) 2023 Luvina Software Company
 * AddEditComponent.ts, July 15, 2023 Toannq
 */
import { employees } from './../../../models/Employees';
import { EmployeeAdd } from './../../../models/EmployeeAdd';
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

import { checkEmployeeReLoginPassword } from 'src/app/validators/password.validator';
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
  errMessage: string = "";
  editMode: boolean = false;
  addMode: boolean = false;
  editConfirm: boolean = false;
  employee!: any;




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
    //Kiểm tra xem trong router có employeeIdEdit không
    if (history.state.employeeIdEdit) {

      this.editMode = true;

    }
    if (!history.state.employeeIdEdit && !history.state.employeeIdEditConfirm) {
      this.addMode = true;

    }
    if (history.state.employeeIdEditConfirm) {
      this.editConfirm = true;
    }

    if (!history.state.employeeIdEdit && !history.state.employeeIdEditConfirm) {
      this.router.navigateByUrl("/user/add")
    }

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
        employeeId: new FormControl(""),
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
          Validators.pattern('^[0-9]+$'),
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

        ]),
        certifications: this.fb.array([
          this.fb.group({
            certificationId: new FormControl(''),
            certificationStartDate: new FormControl(''),
            certificationEndDate: new FormControl(''),
            employeeCertificationScore: new FormControl(''),
          }),
        ]),
      },
      { validators: [checkEmployeeReLoginPassword, CertificationValidator] }
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
     * hoặc trường hợp backend trả về lỗi trùng loginId
     */
    if (history.state.employee || (history.state.message && JSON.parse(localStorage.getItem("employeeConfirmErr") || "null")) || this.editMode) {
      let employee!: any;
      this.isSelectedCerti = true;
      //Thực hiện gán giá trị trong trường hợp back từ ADM005 về
      if (history.state.employee) {
        //gán giá trị được lấy từ router trả về
        employee = history.state.employee;
        this.departmentName = history.state.departmentName;
        //gán giá trị được lấy từ router trả về
        this.certificationName = history.state.certificationName;
        //Gán lại giá trị cho form
        this.setValueForForm(employee);

      }
      //Gán lại giá trị trong trường hợp trả về lỗi trùng employee loginID
      if (history.state.message && JSON.parse(localStorage.getItem("employeeConfirmErr") || "null")) {
        this.errMessage = history.state.message;
        employee = JSON.parse(localStorage.getItem("employeeConfirmErr") || "null").data;
        this.departmentName = JSON.parse(localStorage.getItem("employeeConfirmErr") || "null").departmentName;
        this.certificationName = JSON.parse(localStorage.getItem("employeeConfirmErr") || "null").certificationName;
        //Gán lại giá trị cho form
        this.setValueForForm(employee);

      }
      //Gán lại giá trị trong trường hợp edit
      if (this.editMode) {
        this.employeeService.getEmployeeById(history.state.employeeIdEdit).subscribe(data => {
          this.employee = data;
          employee = this.employee;
          this.departmentName = this.employee?.departmentName;
          this.certificationName = this.employee?.certifications[0]?.certificationName;
          employee.employeeLoginPassword = "";
          //Gán lại giá trị cho form
          this.setValueForForm(employee);
        })

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
      localStorage.setItem("employeeConfirm", JSON.stringify({
        data: this.addForm.value,
        certificationName: this.certificationName,
        departmentName: this.departmentName,
      }))
    } else {
      this.scrollToFirstInvalidControl();
    }
  }
  /**
   * Xử lý việc gán lại certificationName khi thay đổi
   * lựa chọn ở dropdown certification ở giao diện
   * @param id certificationId
   */
  handleCertichange(id: any) {
    let employeeAdd: EmployeeAdd = this.addForm.value;
    const certificationsForm = this.certifications.at(0) as FormGroup;
    if (id) {
      //Set lại biến kiểm tra chọn certificaton dropdown hay không
      this.isSelectedCerti = true;
      let certi = this.certificationList.find((x) => x.certificationId == id);

      //thêm validator cho certificationStartDate,EndDate,Score nếu chọn tiếng Nhật
      this.certificationName = certi?.certificationName ? certi.certificationName : '';
      certificationsForm.get("certificationStartDate")?.patchValue("");
      certificationsForm.get("certificationEndDate")?.patchValue("");
      certificationsForm.get("employeeCertificationScore")?.patchValue("");
      certificationsForm.get("certificationStartDate")?.setValidators([Validators.required]);
      certificationsForm.get("certificationEndDate")?.setValidators([Validators.required]);
      certificationsForm.get("employeeCertificationScore")?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
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
      certificationsForm.get("certificationStartDate")?.patchValue("")
      certificationsForm.get("certificationEndDate")?.patchValue("")
      certificationsForm.get("employeeCertificationScore")?.patchValue("");
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

  /**
   * Xử lý sự kiện khi người dùng thay đổi giá trị của password
   * @param password giá trị của password được thay đổi
   */
  handlePassChange(password: any) {
    if( this.addForm.get("employeeLoginPassword")?.valid){
      this.addForm.get("employeeConfirmPassword")?.markAsTouched();
    }
    if (this.editMode || history.state.employeeIdEditConfirm) {

      if (password) {
        this.addForm.get("employeeLoginPassword")?.setValidators([Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),]);
        this.addForm.get("employeeConfirmPassword")?.setValidators([Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),]);
        this.addForm.get("employeeLoginPassword")?.updateValueAndValidity();
        this.addForm.get("employeeConfirmPassword")?.updateValueAndValidity();

      } else {
        this.addForm.get("employeeLoginPassword")?.clearValidators();
        this.addForm.get("employeeConfirmPassword")?.clearValidators();
        this.addForm.get("employeeConfirmPassword")?.setValue("");
        this.addForm.get("employeeLoginPassword")?.updateValueAndValidity();
        this.addForm.get("employeeConfirmPassword")?.updateValueAndValidity();

      }

    }
  }

  /**
   * Xử lý việc click button Back màn ADM002 hoặc ADM003
   * cho các trường hợp add,edit
   */
  handleBackAddEdit() {
    //Back về trường hợp mode Edit
    if (this.editMode) {
      this.router.navigate(['/user/detail'], { state: { employeeId: this.employee.employeeId } });
    } else {
      //Back về trường hợp mode Add
      this.router.navigate(['/user/list']);
    }
  }

  /**
   * Set lại giá trị cho form trong trường hợp back từ màn khác về
   * @param employee Thông tin của employee
   */
  setValueForForm(employee: any) {
    this.addForm.get("employeeId")?.setValue(employee.employeeId);
    this.addForm.get("employeeName")?.setValue(employee.employeeName);
    this.addForm.get("employeeEmail")?.setValue(employee.employeeEmail);
    this.addForm.get("employeeLoginId")?.setValue(employee.employeeLoginId);
    this.addForm.get("employeeBirthDate")?.setValue(employee.employeeBirthDate);
    this.addForm.get("departmentId")?.setValue(employee.departmentId);
    this.addForm.get("employeeTelephone")?.setValue(employee.employeeTelephone);
    this.addForm.get("employeeNameKana")?.setValue(employee.employeeNameKana);
    if (employee.employeeId && !employee.employeeLoginPassword) {
      this.addForm.get("employeeLoginPassword")?.clearValidators();
      this.addForm.get("employeeConfirmPassword")?.clearValidators();
      this.addForm.get("employeeLoginPassword")?.updateValueAndValidity();
      this.addForm.get("employeeConfirmPassword")?.updateValueAndValidity();

    }
    this.addForm.get("employeeLoginPassword")?.setValue(employee.employeeLoginPassword);
    this.addForm.get("employeeConfirmPassword")?.setValue(employee.employeeLoginPassword);
    const certificationsForm = this.certifications.at(0) as FormGroup;
    if (employee.certifications.length > 0) {

      //thêm validator cho certificationStartDate,EndDate,Score nếu chọn tiếng Nhật
      certificationsForm.get("certificationId")?.patchValue(employee.certifications[0].certificationId);
      certificationsForm.get("certificationStartDate")?.patchValue(employee.certifications[0].certificationStartDate);
      certificationsForm.get("certificationEndDate")?.patchValue(employee.certifications[0].certificationEndDate);
      certificationsForm.get("employeeCertificationScore")?.patchValue(employee.certifications[0].employeeCertificationScore);
      certificationsForm.get("certificationStartDate")?.setValidators([Validators.required]);
      certificationsForm.get("certificationEndDate")?.setValidators([Validators.required]);
      certificationsForm.get("employeeCertificationScore")?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);
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
      this.isSelectedCerti = false;
      //Set lại form nếu bỏ phần Validator của certificationStartDate,EndDate,Score
      certificationsForm.get("certificationId")?.patchValue("");
      certificationsForm.get("certificationStartDate")?.patchValue("")
      certificationsForm.get("certificationEndDate")?.patchValue("")
      certificationsForm.get("employeeCertificationScore")?.patchValue("");
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
   * Xử lý việc scroll màn hình lên vị trị ô input đầu tiên lỗi
   */
  scrollToFirstInvalidControl() {
    let form = document.getElementById('addForm');
    if (form) {
      let firstInvalidControl = form.getElementsByClassName('ng-invalid')[0];
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      (firstInvalidControl as HTMLElement).focus();
    }
  }
}
