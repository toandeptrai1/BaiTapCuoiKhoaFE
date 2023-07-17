import { EmployeeCertification } from './EmployeeCertification';

export interface EmployeeAdd {
  employeeName: string;
  employeeEmail: string;
  employeeLoginId: string;
  employeeTelephone: string;
  employeeBirthDate: string;
  employeeNameKana: string;
  departmentId: string;
  employeeLoginPassword: string;
  employeeConfirmPassword: string;
  certifications: EmployeeCertification[];
}
