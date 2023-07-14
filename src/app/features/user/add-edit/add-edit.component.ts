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
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.css'],
})
export class AddEditComponent implements OnInit {
  bsConfig!: Partial<BsDatepickerConfig>;
  birdDate = new Date();
  startDate = new Date();
  endDate = new Date();
  departments!: departments[];
  certifications: Certification[] = [];
  addForm!: FormGroup;
  certificationName:string="";
  departmentName:string="";
  submitted:boolean=false;

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.bsConfig = {
      dateInputFormat: 'YYYY-MM-DD',
    
    };
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
      employeeConfirmPassword: new FormControl('', Validators.required),
      certifications: this.fb.group({
        certificationId: new FormControl('', Validators.required),
        certificationStartDate: new FormControl('', Validators.required),
        certificationEndDate: new FormControl('', Validators.required),
        employeeCertificationScore: new FormControl('', Validators.required),
      }),
    });
  }
  navigateToADM005() {
    this.submitted=true;
    if(this.addForm.valid){
      this.router.navigate(['/user/confirm'], {
        state: { data: this.addForm.value ,certificationName:this.certificationName,departmentName:this.departmentName},
      });

    }
    
  }
  handleCertichange(id:any){

   let certi= this.certifications.find(x=>x.certificationId==id);
   if(certi){
    this.certificationName=certi.certificationName;
   }


  }
  handleDepartChange(id:any){
   let depart=this.departments.find(x=>x.departmentId==id);
   if(depart){
    this.departmentName=depart.departmentName;
   }

  }
}
