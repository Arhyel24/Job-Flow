import { JobStatus } from "../constants/jobStatus";

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary?: string;
  dateApplied: string;
  status: JobStatus;
  url?: string;
  notes?: string;
  followUpDate?: string;
  contactPerson?: string;
  contactEmail?: string;
  tags?: string[];
}
