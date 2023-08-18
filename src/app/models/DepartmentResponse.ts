/**
 * Copyright(C) 2023 Luvina Software Company
 * DepartmentResponse.ts, July 15, 2023 Toannq
 */
import { departments } from './departments';
/**
 * Tạo interface DepartmentResponse
 * @author Toannq
 */
export interface DepartmentResponse {
  code: number;
  departments: departments[];
}
