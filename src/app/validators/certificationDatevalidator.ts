/**
 * Copyright(C) 2023 Luvina Software Company
 * ConfirmComponent.ts, July 15, 2023 Toannq
 */
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
/**
 * Xử lý việc validate chứng chỉ tiếng Nhật
 * @param formGroup formGroup cần validate
 */
export function CertificationValidator(formGroup: AbstractControl) {

  const startDate = formGroup.get("certifications.0.certificationStartDate");
  const endDate = formGroup.get("certifications.0.certificationEndDate");
  if (startDate?.valid && endDate?.valid) {
    if (new Date(endDate?.value) <= new Date(startDate?.value)) {
      endDate?.setErrors({ dateInvalid: true });
    } else {
      endDate?.setErrors(null);
    }

  }


}
