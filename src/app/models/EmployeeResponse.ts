
import { EmployeeCertification } from './EmployeeCertification';

export interface EmployeeResponse {
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  employeeLoginId: string;
  employeeTelephone: string;
  employeeBirthDate: string;
  employeeNameKana: string;
  departmentId: number;
  departmentName: string;

  certifications: EmployeeCertification[];
}
