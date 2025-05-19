import { JobApplication } from "../types/jobs";
import { JobStatus } from "../constants/jobStatus";

export function getStatusCounts(jobs: JobApplication[]) {
  const counts: Record<JobStatus, number> = {
    applied: 0,
    interviewing: 0,
    offered: 0,
    rejected: 0,
    accepted: 0,
    declined: 0,
  };

  jobs.forEach((job) => {
    counts[job.status]++;
  });

  return counts;
}

export function filterJobsByStatus(
  jobs: JobApplication[],
  status: JobStatus | "all"
) {
  if (status === "all") {
    return jobs;
  }
  return jobs.filter((job) => job.status === status);
}

export function searchJobs(jobs: JobApplication[], query: string) {
  if (!query.trim()) {
    return jobs;
  }

  const lowercaseQuery = query.toLowerCase();
  return jobs.filter((job) => {
    return (
      job.company.toLowerCase().includes(lowercaseQuery) ||
      job.role.toLowerCase().includes(lowercaseQuery) ||
      job.location.toLowerCase().includes(lowercaseQuery) ||
      (job.notes && job.notes.toLowerCase().includes(lowercaseQuery)) ||
      (job.contactPerson &&
        job.contactPerson.toLowerCase().includes(lowercaseQuery)) ||
      (job.tags &&
        job.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)))
    );
  });
}
