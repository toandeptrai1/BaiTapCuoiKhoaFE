import { employees } from './../../../models/Employees';
import { EmployeeAdd } from './../../../models/EmployeeAdd';
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

    } else {
      this.addMode = true;
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
      { validator: checkEmployeeReLoginPassword }
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
      if (history.state.employee) {
        //gán giá trị được lấy từ router trả về
        employee = history.state.employee;
        this.departmentName = history.state.departmentName;
        //gán giá trị được lấy từ router trả về
        this.certificationName = history.state.certificationName;
        this.setValueForForm(employee, employee.employeeLoginPassword, employee.employeeLoginPassword);
      }
      //Gán lại giá trị trong trường hợp trả về lỗi trùng employee loginID
      if (history.state.message && JSON.parse(localStorage.getItem("employeeConfirmErr") || "null")) {
        this.errMessage = history.state.message;
        employee = JSON.parse(localStorage.getItem("employeeConfirmErr") || "null").data;
        this.departmentName = JSON.parse(localStorage.getItem("employeeConfirmErr") || "null").departmentName;
        this.certificationName = JSON.parse(localStorage.getItem("employeeConfirmErr") || "null").certificationName;
        this.setValueForForm(employee, employee.employeeLoginPassword, employee.employeeLoginPassword);
      }
      if (this.editMode) {
        this.employeeService.getEmployeeById(history.state.employeeIdEdit).subscribe(data => {
          this.employee = data;
          employee = this.employee;
          this.departmentName = this.employee?.departmentName;
          this.certificationName = this.employee?.certifications[0]?.certificationName;
          this.setValueForForm(employee, "", "");
          console.log(employee);
        })

      }
      if (history.state.employeeIdEditConfirm) {
        this.employeeService.getEmployeeById(history.state.employeeIdEditConfirm).subscribe(data => {
        
          employee = history.state.employee;
          this.employee=data;
          if(employee.employeeLoginPassword== data.employeeLoginPassword){
            console.log("ko pass");
           employee.employeeLoginPassword="";
           this.addForm.get("employeeLoginPassword")?.setValue("");

          }else{
            console.log("co pass");
            this.addForm.get("employeeLoginPassword")?.setValue(employee.employeeLoginPassword);
          }
          this.departmentName = this.employee?.departmentName;
          this.certificationName = this.employee?.certifications[0]?.certificationName;
          this.setValueForForm(employee,employee.employeeLoginPassword, employee.employeeLoginPassword);
         
         
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
      if (!this.addForm.get("employeeLoginPassword")?.value) {
        this.addForm.get("employeeLoginPassword")?.setValue(this.employee.employeeLoginPassword);

      }
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
      if (this.editMode) {
        //Set lại biến kiểm tra chọn certificaton dropdown hay không
        this.isSelectedCerti = true;
        let certi = this.certificationList.find((x) => x.certificationId == id);
        console.log(certi);
        console.log(id);
        console.log(this.employee.certifications);
        //thêm validator cho certificationStartDate,EndDate,Score nếu chọn tiếng Nhật
        this.certificationName = certi?.certificationName ? certi.certificationName : '';
        let certificationForm = certificationsForm.at(0) as FormGroup;
        certificationForm.get("certificationStartDate")?.patchValue("")
        certificationForm.get("certificationEndDate")?.patchValue("")
        certificationForm.get("employeeCertificationScore")?.patchValue("");
        certificationForm.get("certificationStartDate")?.setValidators([Validators.required]);
        certificationForm.get("certificationEndDate")?.setValidators([Validators.required, CertificationValidator]);
        certificationForm.get("employeeCertificationScore")?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')]);

        for (let cer of this.employee.certifications) {
          if (cer.certificationId == id) {
            certificationForm.get("certificationStartDate")?.patchValue(cer.certificationStartDate);
            certificationForm.get("certificationEndDate")?.patchValue(cer.certificationEndDate);
            certificationForm.get("employeeCertificationScore")?.patchValue(cer.employeeCertificationScore);
           
          }

        }


      }
      if (this.addMode) {
        //Set lại biến kiểm tra chọn certificaton dropdown hay không
        this.isSelectedCerti = true;
        let certi = this.certificationList.find((x) => x.certificationId == id);
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

      }
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
  /**
   * Set lại giá trị cho các trường của form khi dữ liệu về employee thay đổi
   * @param employee thong tin ve employee set cho form
   */
  setValueForForm(employee: any, password: any, repassword: any) {
   
    console.log( employee.employeeLoginPassword);
    if (this.editMode||history.state.employeeIdEditConfirm) {
      if (this.addForm.get("employeeLoginPassword")?.value &&
        this.addForm.get("employeeLoginPassword")?.value != employee.employeeLoginPassword
        ) {
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

            ]),
            certifications: this.fb.array([
              this.fb.group({
                certificationId: new FormControl(this.addForm.get("certifications.0.certificationId")?.value),
                certificationStartDate: new FormControl(this.addForm.get("certifications.0.certificationStartDate")?.value),
                certificationEndDate: new FormControl(this.addForm.get("certifications.0.certificationEndDate")?.value),
                employeeCertificationScore: new FormControl(this.addForm.get("certifications.0.employeeCertificationScore")?.value),
              }),
            ]),
          },
          { validator: checkEmployeeReLoginPassword }
        );


      } else {
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
              Validators.pattern('[a-zA-Z0-9!-/:-@\\[-`{-~]+'),
            ]),
            employeeBirthDate: new FormControl('', Validators.required),
            employeeNameKana: new FormControl('', [
              Validators.required,
              Validators.maxLength(125),
              Validators.pattern('[ぁ-んァ-ン一-龯々〆〤ー・｜｡-ﾟ]+'),
            ]),
            departmentId: new FormControl('', Validators.required),
            employeeLoginPassword: new FormControl(''),
            employeeConfirmPassword: new FormControl(''),
            certifications: this.fb.array([
              this.fb.group({
                certificationId: new FormControl(this.addForm.get("certifications.0.certificationId")?.value),
                certificationStartDate: new FormControl(this.addForm.get("certifications.0.certificationStartDate")?.value),
                certificationEndDate: new FormControl(this.addForm.get("certifications.0.certificationEndDate")?.value),
                employeeCertificationScore: new FormControl(this.addForm.get("certifications.0.employeeCertificationScore")?.value),
              }),
            ]),
          }
        );

      }
    }
    //Gán lại giá trị cho form
    this.addForm.get("employeeId")?.setValue(employee.employeeId);
    this.addForm.get("employeeName")?.setValue(employee.employeeName);
    this.addForm.get("employeeEmail")?.setValue(employee.employeeEmail);
    this.addForm.get("employeeLoginId")?.setValue(employee.employeeLoginId);
    this.addForm.get("employeeBirthDate")?.setValue(employee.employeeBirthDate);
    this.addForm.get("departmentId")?.setValue(employee.departmentId);
    this.addForm.get("employeeTelephone")?.setValue(employee.employeeTelephone);
    this.addForm.get("employeeNameKana")?.setValue(employee.employeeNameKana);

    this.addForm.get("employeeLoginPassword")?.setValue(password);
    this.addForm.get("employeeLoginPassword")?.markAsTouched();
    this.addForm.get("employeeConfirmPassword")?.setValue(repassword);
    this.addForm.get("employeeConfirmPassword")?.markAsTouched();
    if (this.editMode||history.state.employeeIdEditConfirm) {
      if (employee.certifications.length &&employee.certifications.length > 0) {
        this.certifications.clear();
        for (let i = 0; i < employee.certifications.length; i++) {
          const certificationForm = this.fb.group({
            certificationId: new FormControl(""),
            certificationStartDate: new FormControl("", Validators.required),
            certificationEndDate: new FormControl("", [Validators.required, CertificationValidator]),
            employeeCertificationScore: new FormControl("", [Validators.required, Validators.pattern('^[0-9]+$')]),
          });
          certificationForm.get("certificationId")?.patchValue(employee.certifications[i] ? employee.certifications[i].certificationId : '')
          certificationForm.get("certificationStartDate")?.patchValue(employee.certifications[i] ? employee.certifications[i].certificationStartDate : '')
          certificationForm.get("certificationEndDate")?.patchValue(employee.certifications[i] ? employee.certifications[i].certificationEndDate : '')
          certificationForm.get("employeeCertificationScore")?.patchValue(employee.certifications[i] ? employee.certifications[i].employeeCertificationScore : '')
          certificationForm.get("certificationStartDate")?.setValidators([Validators.required])
          certificationForm.get("certificationEndDate")?.setValidators([Validators.required, CertificationValidator])
          certificationForm.get("employeeCertificationScore")?.setValidators([Validators.required, Validators.pattern('^[0-9]+$')])
          this.certifications.push(certificationForm);



        }
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
        let certificationForm = this.certifications.at(0) as FormGroup;
        certificationForm.get("certificationId")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationId : this.addForm.get("certifications.0.certificationId")?.value)
        certificationForm.get("certificationStartDate")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationStartDate : this.addForm.get("certifications.0.certificationStartDate")?.value)
        certificationForm.get("certificationEndDate")?.patchValue(employee.certifications[0] ? employee.certifications[0].certificationEndDate : this.addForm.get("certifications.0.certificationEndDate")?.value)
        certificationForm.get("employeeCertificationScore")?.patchValue(employee.certifications[0] ? employee.certifications[0].employeeCertificationScore : this.addForm.get("certifications.0.employeeCertificationScore")?.value);
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
    if (this.addMode||history.state.employeeIdEditConfirm) {
      const certificationForm = this.certifications.at(0) as FormGroup;
      if (employee.certifications.length > 0) {
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

      } else {
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
   * Xử lý sự kiện khi người dùng thay đổi giá trị của password
   * @param password giá trị của password được thay đổi
   */
  handlePassChange(password: any) {
    if (this.editMode) {
      this.setValueForForm(this.employee, password, "");
    }
    if (history.state.employeeIdEditConfirm) {
      console.log("worked");
      this.setValueForForm(this.employee, password, "");
    }

  }
  /**
   * Xử lý việc click button Back màn ADM002 hoặc ADM003
   * cho các trường hợp add,edit
   */
  handleBackAddEdit(){
    if(this.editMode){
      this.router.navigate(['/user/detail'],{state:{employeeId:this.employee.employeeId}});
    }else{
      this.router.navigate(['/user/list']);
    }
  }


}
