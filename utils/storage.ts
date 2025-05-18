import AsyncStorage from '@react-native-async-storage/async-storage';
import { JobApplication } from '../types/jobs';
import uuid from 'react-native-uuid';

// Storage keys
const JOBS_STORAGE_KEY = 'jobtracker_jobs';
const LAST_SYNC_KEY = 'jobtracker_last_sync';
const PENDING_CHANGES_KEY = 'jobtracker_pending_changes';

export function createJob(jobData: Omit<JobApplication, 'id'>): JobApplication {
  return {
    id: uuid.v4().toString(),
    ...jobData,
  };
}

interface PendingChange {
  type: 'create' | 'update' | 'delete';
  job: JobApplication;
  timestamp: number;
}

// Local storage functions
async function getLocalJobs(): Promise<JobApplication[]> {
  try {
    const data = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading local jobs:', error);
    return [];
  }
}

async function setLocalJobs(jobs: JobApplication[]): Promise<void> {
  try {
    await AsyncStorage.setItem(JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving local jobs:', error);
  }
}

async function getPendingChanges(): Promise<PendingChange[]> {
  try {
    const data = await AsyncStorage.getItem(PENDING_CHANGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading pending changes:', error);
    return [];
  }
}

async function setPendingChanges(changes: PendingChange[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes));
  } catch (error) {
    console.error('Error saving pending changes:', error);
  }
}

// Public API
export async function getJobs(): Promise<JobApplication[]> {
  return await getLocalJobs();
}

export async function addJob(job: JobApplication): Promise<void> {
  try {
    const jobs = await getLocalJobs();
    const updatedJobs = [...jobs, job];
    await setLocalJobs(updatedJobs);

    const pendingChanges = await getPendingChanges();
    pendingChanges.push({
      type: 'create',
      job,
      timestamp: Date.now(),
    });
    await setPendingChanges(pendingChanges);
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
}

export async function updateJob(job: JobApplication): Promise<void> {
  try {
    const jobs = await getLocalJobs();
    const updatedJobs = jobs.map(j => j.id === job.id ? job : j);
    await setLocalJobs(updatedJobs);

    const pendingChanges = await getPendingChanges();
    pendingChanges.push({
      type: 'update',
      job,
      timestamp: Date.now(),
    });
    await setPendingChanges(pendingChanges);
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  try {
    const jobs = await getLocalJobs();
    const jobToDelete = jobs.find(j => j.id === jobId);
    if (!jobToDelete) return;

    const updatedJobs = jobs.filter(j => j.id !== jobId);
    await setLocalJobs(updatedJobs);

    const pendingChanges = await getPendingChanges();
    pendingChanges.push({
      type: 'delete',
      job: jobToDelete,
      timestamp: Date.now(),
    });
    await setPendingChanges(pendingChanges);
  } catch (error) {
    console.error('Error deleting job:', error);
    throw error;
  }
}

export async function clearAllJobs(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      JOBS_STORAGE_KEY,
      LAST_SYNC_KEY,
      PENDING_CHANGES_KEY,
    ]);
  } catch (error) {
    console.error('Error clearing all jobs:', error);
    throw error;
  }
}
