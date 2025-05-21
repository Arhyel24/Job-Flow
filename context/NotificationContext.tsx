import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { useRouter, RelativePathString } from "expo-router";

import { JobApplication } from "../types/jobs";
import { JobStatus } from "../constants/jobStatus";
import { JOBS_STORAGE_KEY } from "../utils/constants";

type NotificationContextType = {
  lastOpened: number | null;
};
const NotificationContext = createContext<NotificationContextType>({
  lastOpened: null,
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [lastOpened, setLastOpened] = useState<number | null>(null);
  const appState = useRef(AppState.currentState);

  // Listen for tap‐responses to route into the job modal
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const jobId = response.notification.request.content.data.jobId as
          | string
          | undefined;
        if (jobId) {
          router.push(`/(modals)/job/${jobId}` as RelativePathString);
        }
      }
    );
    return () => Notifications.removeNotificationSubscription(sub);
  }, [router]);

  // On mount: register & schedule everything
  useEffect(() => {
    (async () => {
      await registerPermissions();
      await scheduleAllJobReminders();
      await scheduleInactivityReminder();
      const now = Date.now();
      setLastOpened(now);
      await AsyncStorage.setItem("lastOpened", now.toString());
    })();

    const sub = AppState.addEventListener("change", async (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === "active"
      ) {
        // App just came to foreground
        const now = Date.now();
        setLastOpened(now);
        await AsyncStorage.setItem("lastOpened", now.toString());
        // Reschedule inactivity from now
        await scheduleInactivityReminder();
      }
      appState.current = nextState;
    });

    return () => sub.remove();
  }, []);

  return (
    <NotificationContext.Provider value={{ lastOpened }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);

/** Request permissions on physical device */
async function registerPermissions() {
  if (!Device.isDevice) {
    console.warn("Must use physical device for notifications");
    return;
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Notification permissions not granted!");
  }
  // Configure how notifications are shown when app is foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/** Read all jobs and schedule their reminders */
async function scheduleAllJobReminders() {
  // cancel old job reminders
  await Notifications.cancelAllScheduledNotificationsAsync();

  const raw = await AsyncStorage.getItem(JOBS_STORAGE_KEY);
  if (!raw) return;
  const jobs: JobApplication[] = JSON.parse(raw);

  const validStatuses: JobStatus[] = [
    "applied",
    "interviewing",
    "offered",
    "accepted",
  ];

  for (const job of jobs) {
    if (!validStatuses.includes(job.status)) continue;
    const appliedDate = new Date(job.dateApplied);
    const follow = job.followUpDate ? new Date(job.followUpDate) : null;

    // If follow-up exists, schedule 3 days before & on the follow day
    if (follow) {
      const msDay = 24 * 60 * 60 * 1000;
      const threeDaysOut = new Date(follow.getTime() - 3 * msDay);

      if (threeDaysOut > new Date()) {
        await scheduleNotificationForJob(
          job,
          threeDaysOut,
          `${job.company}: follow-up in 3 days`,
          `Your follow-up for ${job.role} at ${
            job.company
          } is coming up on ${follow.toLocaleDateString()}.`
        );
      }
      if (follow > new Date()) {
        await scheduleNotificationForJob(
          job,
          follow,
          `${job.company}: follow-up today`,
          `Today is your follow-up date for ${job.role}. Tap to view details.`
        );
      }
    } else {
      // No follow date → remind 1 week after applied
      const oneWeek = new Date(appliedDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      if (oneWeek > new Date()) {
        await scheduleNotificationForJob(
          job,
          oneWeek,
          `${job.company}: check in`,
          `It’s been a week since you applied for ${job.role}. Time to follow up?`
        );
      }
    }
  }
}

/** Helper to schedule one notification tied to a job */
async function scheduleNotificationForJob(
  job: JobApplication,
  date: Date,
  title: string,
  body: string
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { jobId: job.id },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      repeats: false,
      seconds: date.getTime(),
    },
  });
}

/** If app hasn’t been opened in 7 days, remind user to open it */
async function scheduleInactivityReminder() {
  const raw = await AsyncStorage.getItem("lastOpened");
  const last = raw ? parseInt(raw, 10) : Date.now();
  const nextRemind = last + 7 * 24 * 60 * 60 * 1000;
  if (nextRemind > nextRemind) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "👋 We miss you!",
        body: "It’s been a while—tap to check your job applications.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        repeats: true,
        seconds: nextRemind,
      },
    });
  }
}
