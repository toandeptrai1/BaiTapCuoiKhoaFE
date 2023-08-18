/**
 * Copyright(C) 2023 Luvina Software Company
 * ApiResponse.ts, July 15, 2023 Toannq
 */
import { employees } from "./Employees";
/**
 * Tạo interface ApiResponse
 * @author Toannq
 */
export interface ApiResponse{
    code?:number;
    totalRecords:number;
    employees:employees[],
    
}