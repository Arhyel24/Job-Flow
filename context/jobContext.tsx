import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { JobApplication } from "../types/jobs";
import { addJob, deleteJob, getJobs, updateJob } from "../utils/storage";
import Toast from "react-native-toast-message";

type JobsContextType = {
  jobs: JobApplication[];
  addJobFromContext: (job: JobApplication) => Promise<void>;
  refreshJobs: () => Promise<void>;
  handleUpdateJob: (job: JobApplication) => Promise<void>;
  handleDeleteJob: (id: string) => Promise<void>;
};

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: React.ReactNode }) => {
  const [jobs, setJobs] = useState<JobApplication[]>([]);

  const refreshJobs = async () => {
    try {
      const stored = await getJobs();
      setJobs(stored || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load jobs",
        text2: "Please try again later.",
      });
    }
  };

  useEffect(() => {
    refreshJobs();
  }, []);

  const addJobFromContext = async (job: JobApplication) => {
    try {
      await addJob(job);
      await refreshJobs();
    } catch (error) {
      console.error("Error adding job:", error);
      Toast.show({
        type: "error",
        text1: "Add Job Failed",
        text2: "Could not add the job application.",
      });
    }
  };

  const handleDeleteJob = async (id: string) => {
    try {
      await deleteJob(id);
      await refreshJobs();
    } catch (error) {
      console.error("Error deleting job:", error);
      Toast.show({
        type: "error",
        text1: "Delete Failed",
        text2: "Could not delete the job application.",
      });
    }
  };

  const handleUpdateJob = async (job: JobApplication) => {
    try {
      await updateJob(job);
      await refreshJobs();
    } catch (error) {
      console.error("Error updating job:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Could not update the job application.",
      });
    }
  };

  const value = useMemo(
    () => ({
      jobs,
      addJobFromContext,
      refreshJobs,
      handleUpdateJob,
      handleDeleteJob,
    }),
    [jobs]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
