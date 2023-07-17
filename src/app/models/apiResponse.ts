import { employees } from "./Employees";

export interface ApiResponse{
    code?:number;
    totalRecords:number;
    employees:employees[],
    
}