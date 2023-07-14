import { Router } from '@angular/router';
import { Certification } from './../../../models/Certification';
import { EmployeeService } from './../../../services/employee.service';
import { departments } from './../../../models/departments';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditComponent implements OnInit {
  birdDate = new Date();
  startDate = new Date();
  endDate = new Date();
  departments!: departments[];
  certifications: Certification[] = [];
  addForm!: FormGroup;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.employeeService.getDepartments().subscribe((data) => {
      this.departments = data.departments;
    });

    this.employeeService
      .getCertification()
      .subscribe((data) => (this.certifications = data.certifications));
    this.addForm = this.fb.group({
      employeeName: new FormControl('', Validators.required),
      employeeEmail: new FormControl('', Validators.required),
      employeeLoginId: new FormControl('', Validators.required),
      employeeTelephone: new FormControl('', Validators.required),
      employeeBirthDate: new FormControl('', Validators.required),
      employeeNameKana: new FormControl('', Validators.required),
      departmentId: new FormControl('', Validators.required),
      employeeLoginPassword: new FormControl('', Validators.required),
      certifications: this.fb.group({
        certificationId: new FormControl('', Validators.required),
        certificationStartDate: new FormControl('', Validators.required),
        certificationEndDate: new FormControl('', Validators.required),
        employeeCertificationScore: new FormControl('', Validators.required),
      }),
    });
  }
  navigateToADM005() {
    this.router.navigate(['/user/confirm'], {
      state: { data: this.addForm.value },
    });
  }
}
