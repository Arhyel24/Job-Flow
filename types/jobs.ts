import { JobStatus } from "../constants/jobStatus";


export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary?: string;
  dateApplied: string; // ISO date string
  status: JobStatus;
  url?: string;
  notes?: string;
  followUpDate?: string; // ISO date string
  contactPerson?: string;
  contactEmail?: string;
  tags?: string[];
}