/**
 * Copyright(C) 2023 Luvina Software Company
 * EmployeeResponse.ts, July 15, 2023 Toannq
 */
import { EmployeeCertification } from './EmployeeCertification';
/**
 * Tạo interface EmployeeResponse
 * @augments Toannq
 */
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
