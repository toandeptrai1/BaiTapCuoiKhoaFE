import { AbstractControl, FormGroup, ValidatorFn } from '@angular/forms';

export function CertificationValidator(
  controlName: string,
  compareControlName: string
) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls['certifications'].get('0')?.get(controlName);
    const compareControl = formGroup.controls['certifications'].get('0')?.get(compareControlName);

    if (new Date(control?.value) >= new Date(compareControl?.value)) {

      compareControl?.setErrors({ dateInvalid: true });
    } else {
      compareControl?.setErrors(null);
    }
  };
}
