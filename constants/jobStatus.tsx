import { z } from "zod";
import { useTheme } from "../context/themeContext";

const jobStatusArray = [
  "applied",
  "interviewing",
  "offered",
  "rejected",
  "accepted",
  "declined",
] as const;

export type JobStatus = (typeof jobStatusArray)[number];

export const jobStatusEnum = z.enum(jobStatusArray);

export const useStatusConfig = () => {
  const { theme: colors } = useTheme();

  const statusConfig = {
    applied: {
      color: colors.primary,
      background: colors.primaryLight,
      label: "Applied",
    },
    interviewing: {
      color: colors.warning,
      background: colors.warningLight,
      label: "Interviewing",
    },
    offered: {
      color: colors.accent,
      background: colors.accentLight,
      label: "Offered",
    },
    rejected: {
      color: colors.error,
      background: colors.errorLight,
      label: "Rejected",
    },
    accepted: {
      color: colors.success,
      background: colors.successLight,
      label: "Accepted",
    },
    declined: {
      color: "#6B7280",
      background: "#F3F4F6",
      label: "Declined",
    },
  } as const;

  const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
    label: config.label,
    value: value as JobStatus,
  }));

  return { statusConfig, statusOptions };
};
