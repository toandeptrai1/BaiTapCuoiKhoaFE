/**
 * Copyright(C) 2023 Luvina Software Company
 * CertificationsResponse.ts, July 15, 2023 Toannq
 */
import { Certification } from "./Certification";
/**
 * Tạo interface CertificationsResponse
 * @author Toannq
 */
export interface CertificationsResponse{
    code: number,
    certifications:Certification[];

}