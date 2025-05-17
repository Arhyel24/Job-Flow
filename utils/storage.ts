import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
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

// Sync functions
async function syncWithServer(): Promise<void> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return;

    const pendingChanges = await getPendingChanges();

    for (const change of pendingChanges) {
      switch (change.type) {
        case 'create':
          await supabase.from('jobs').insert(change.job);
          break;
        case 'update':
          await supabase.from('jobs').update(change.job).eq('id', change.job.id);
          break;
        case 'delete':
          await supabase.from('jobs').delete().eq('id', change.job.id);
          break;
      }
    }

    await setPendingChanges([]);

    const { data: serverJobs, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    await setLocalJobs(serverJobs);
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Error syncing with server:', error);
    throw error;
  }
}


// Public API
export async function getJobs(): Promise<JobApplication[]> {
  return await getLocalJobs();
}

export async function addJob(job: JobApplication): Promise<void> {
  try {
    // Add to local storage
    const jobs = await getLocalJobs();
    const updatedJobs = [...jobs, job];
    await setLocalJobs(updatedJobs);

    // Add to pending changes
    const pendingChanges = await getPendingChanges();
    pendingChanges.push({
      type: 'create',
      job,
      timestamp: Date.now(),
    });
    await setPendingChanges(pendingChanges);

    // Try to sync if online
    try {
      await syncWithServer();
    } catch (error) {
      console.log('Will sync later:', error);
    }
  } catch (error) {
    console.error('Error adding job:', error);
    throw error;
  }
}

export async function updateJob(job: JobApplication): Promise<void> {
  try {
    // Update local storage
    const jobs = await getLocalJobs();
    const updatedJobs = jobs.map(j => j.id === job.id ? job : j);
    await setLocalJobs(updatedJobs);

    // Add to pending changes
    const pendingChanges = await getPendingChanges();
    pendingChanges.push({
      type: 'update',
      job,
      timestamp: Date.now(),
    });
    await setPendingChanges(pendingChanges);

    // Try to sync if online
    try {
      await syncWithServer();
    } catch (error) {
      console.log('Will sync later:', error);
    }
  } catch (error) {
    console.error('Error updating job:', error);
    throw error;
  }
}

export async function deleteJob(jobId: string): Promise<void> {
  try {
    // Delete from local storage
    const jobs = await getLocalJobs();
    const jobToDelete = jobs.find(j => j.id === jobId);
    if (!jobToDelete) return;

    const updatedJobs = jobs.filter(j => j.id !== jobId);
    await setLocalJobs(updatedJobs);

    // Add to pending changes
    const pendingChanges = await getPendingChanges();
    pendingChanges.push({
      type: 'delete',
      job: jobToDelete,
      timestamp: Date.now(),
    });
    await setPendingChanges(pendingChanges);

    // Try to sync if online
    try {
      await syncWithServer();
    } catch (error) {
      console.log('Will sync later:', error);
    }
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

// Network status listener
let syncInterval: NodeJS.Timeout;

export function startSyncService(intervalMs = 60000): void {
  // Clear any existing interval
  if (syncInterval) {
    clearInterval(syncInterval);
  }

  // Set up periodic sync
  syncInterval = setInterval(async () => {
    try {
      await syncWithServer();
    } catch (error) {
      console.log('Sync failed, will retry later:', error);
    }
  }, intervalMs);
}

export function stopSyncService(): void {
  if (syncInterval) {
    clearInterval(syncInterval);
  }
}