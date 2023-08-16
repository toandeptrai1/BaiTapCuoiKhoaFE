import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function CertificationValidator(formGroup: AbstractControl) {

  const startDate = formGroup.get("certifications.0.certificationStartDate");
  const endDate = formGroup.get("certifications.0.certificationEndDate");
  if (startDate?.valid && new Date(endDate?.value) <= new Date(startDate?.value)) {
    endDate?.setErrors({ dateInvalid: true });
  } else {
    
  }

}
