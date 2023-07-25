import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


export function PasswordValidator(formControll: AbstractControl): ValidationErrors | null {
  const control = formControll.root.get("employeeLoginPassword");
  const matchingControl = formControll.root.get("employeeConfirmPassword");

  if (control?.value !== matchingControl?.value) {

    return { mustMatch: true };
  }
  return null;


}

export function checkEmployeeReLoginPassword(formGroup: FormGroup) {
  const employeeLoginPassword = formGroup.get('employeeLoginPassword');
  const employeeReLoginPassword = formGroup.get('employeeConfirmPassword');
  // Kiểm tra employeeConfirmPassword trùng với EmployeeLoginPassword
  if (employeeLoginPassword?.invalid || employeeReLoginPassword?.value === employeeLoginPassword?.value) {
    employeeReLoginPassword?.setErrors(null);
  } else {
    employeeReLoginPassword?.setErrors({ mustMatch: true });
  }
}