import { Platform } from "react-native";
import Constants, {
  AndroidManifest,
  IOSManifest,
  WebManifest,
} from "expo-constants";
import getAccessToken from "./token";

const BACKUP_FILENAME = "jobflow_backup.json";
const MIME_TYPE = "application/json";

type PlatformSpecificManifest = AndroidManifest | IOSManifest | WebManifest;

const getPlatformManifest = (): PlatformSpecificManifest | undefined => {
  const manifest = Constants.manifest;
  if (!manifest) return undefined;

  switch (Platform.OS) {
    case "ios":
      return manifest as IOSManifest;
    case "android":
      return manifest as AndroidManifest;
    case "web":
      return manifest as WebManifest;
    default:
      return manifest as PlatformSpecificManifest;
  }
};

export const useBackup = () => {
  const createBackup = async (appData: any) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const backupData = {
        metadata: {
          version: "1.0",
          lastUpdated: new Date().toISOString(),
          device: Platform.OS,
          appVersion: getPlatformManifest()?.version || "unknown",
        },
        appData: appData,
      };

      const jsonData = JSON.stringify(backupData);
      const existingFileId = await findBackupFile(accessToken);

      if (existingFileId) {
        await updateFile(accessToken, existingFileId, jsonData);
      } else {
        await createFile(accessToken, jsonData);
      }

      return true;
    } catch (error) {
      console.error("Backup failed:", error);
      return false;
    }
  };

  const restoreBackup = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const fileId = await findBackupFile(accessToken);
      if (!fileId) return null;

      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch backup");

      const backupData = await response.json();
      validateBackup(backupData);

      return {
        metadata: backupData.metadata,
        appData: backupData.appData,
      };
    } catch (error) {
      console.error("Restore failed:", error);
      return null;
    }
  };

  const getBackupInfo = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) throw new Error("Not authenticated");

      const fileId = await findBackupFile(accessToken);
      if (!fileId) return null;

      const metaResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?fields=modifiedTime,size`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!metaResponse.ok) throw new Error("Failed to fetch file metadata");

      const metadata = await metaResponse.json();

      const contentResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!contentResponse.ok)
        throw new Error("Failed to fetch backup content");

      const backupData = await contentResponse.json();

      return {
        lastUpdated: metadata.modifiedTime,
        size: parseInt(metadata.size || "0"),
        version: backupData.metadata?.version,
        device: backupData.metadata?.device,
        appVersion: backupData.metadata?.appVersion,
      };
    } catch (error) {
      console.error("Failed to get backup info:", error);
      return null;
    }
  };

  const findBackupFile = async (accessToken: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILENAME}' and 'appDataFolder' in parents`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to search files");

      const data = await response.json();
      return data.files?.[0]?.id || null;
    } catch (error) {
      console.error("File search failed:", error);
      return null;
    }
  };

  const validateBackup = (backupData: any) => {
    if (!backupData?.metadata?.version) {
      throw new Error("Invalid backup format");
    }
  };

  const createFile = async (accessToken: string, jsonData: string) => {
    const metadata = {
      name: BACKUP_FILENAME,
      mimeType: MIME_TYPE,
      parents: ["appDataFolder"],
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", new Blob([jsonData], { type: MIME_TYPE }));

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/related",
        },
        body: form,
      }
    );

    if (!response.ok) throw new Error("Failed to create file");
  };

  const updateFile = async (
    accessToken: string,
    fileId: string,
    jsonData: string
  ) => {
    const metadata = {
      name: BACKUP_FILENAME,
      mimeType: MIME_TYPE,
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", new Blob([jsonData], { type: MIME_TYPE }));

    const response = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/related",
        },
        body: form,
      }
    );

    if (!response.ok) throw new Error("Failed to update file");
  };

  return { createBackup, restoreBackup, getBackupInfo };
};
