/**
 * Copyright(C) 2023 Luvina Software Company
 * EmployeeAdd.ts, July 15, 2023 Toannq
 */
import { EmployeeCertification } from './EmployeeCertification';
/**
 * Tạo interface EmployeeAdd
 * @author Toannq
 */
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
