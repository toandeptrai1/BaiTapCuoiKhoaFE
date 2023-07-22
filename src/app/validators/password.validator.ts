import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


export function PasswordValidator(formControll: AbstractControl): ValidationErrors | null {
  const control = formControll.root.get("employeeLoginPassword");
  const matchingControl = formControll.root.get("employeeConfirmPassword");

  if (control?.value !== matchingControl?.value) {

    return { mustMatch: true };
  }
  return null;


}
