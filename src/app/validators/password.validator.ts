/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Xử lý validate password
 * @param formControll formcontroll cần validate
 * @returns ValidatorErrors nếu có lỗi
 */
export function PasswordValidator(formControll: AbstractControl): ValidationErrors | null {
  const control = formControll.root.get("employeeLoginPassword");
  const matchingControl = formControll.root.get("employeeConfirmPassword");

  if (control?.value !== matchingControl?.value) {

    return { mustMatch: true };
  }
  return null;


}
/**
 * Xử lý validate password
 * @param formGroup formGroup cần validate
 */
export function checkEmployeeReLoginPassword(formGroup: FormGroup) {
  //Lấy các giá trị của form
  const employeeLoginPassword = formGroup.get('employeeLoginPassword');
  const employeeReLoginPassword = formGroup.get('employeeConfirmPassword');
  const employeeId = formGroup.get("employeeId")?.value;
  //Kiểm tra xem có employeeId không
  if (!employeeId) {
    // Kiểm tra employeeConfirmPassword trùng với EmployeeLoginPassword
    if (employeeLoginPassword?.invalid || employeeReLoginPassword?.value === employeeLoginPassword?.value) {
      employeeReLoginPassword?.setErrors(null);
    } else {
      employeeReLoginPassword?.setErrors({ mustMatch: true });
    }
  } else {
    if (!employeeLoginPassword?.value) {
      employeeReLoginPassword?.setErrors(null);
    } else {
      if (employeeLoginPassword?.invalid || employeeReLoginPassword?.value === employeeLoginPassword?.value) {
        employeeReLoginPassword?.setErrors(null);
      } else {
        employeeReLoginPassword?.setErrors({ mustMatch: true });
      }
    }
  }
}
