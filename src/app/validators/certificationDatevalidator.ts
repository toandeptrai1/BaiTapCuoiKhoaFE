import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function CertificationValidator(formControll: AbstractControl): ValidationErrors | null {

  const controllCompare = formControll.parent?.get("certificationStartDate");
  if (new Date(formControll?.value) <= new Date(controllCompare?.value)) {
    return { dateInvalid: true };
  }
  return null;
}
