/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Xử lý việc validate date
 * @param controll formControll cần kiểm tra
 * @returns ValidationErrors nếu lỗi
 */
export function dateValidator(controll: AbstractControl): ValidationErrors | null {
  const checkDate = controll.value;
  // Kiểm tra ngày không tồn tại
  if (!checkDate) {
    return { required: true };
  }
  // Kiểm tra ngày hợp lệ
  if (isNaN(Date.parse(checkDate))) {
    return { invalidDate: true };
  }
  return null;


}
