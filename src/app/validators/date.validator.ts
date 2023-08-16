import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';


export function dateValidator(controll: AbstractControl): ValidationErrors | null {
  const checkDate = controll.value;
  // Kiểm tra ngày không tồn tại
  if (!checkDate) {
    return { required: true };
  }
  // Kiểm tra ngày hợp lệ
  if (isNaN(checkDate.getTime())) {
    return { invalidDate: true };
  }
  return null;


}
