import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import Toast from "react-native-toast-message";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";
import {
  ACCESS_TOKEN_KEY,
  GOOGLE_WEB_CLIENT_ID,
  IOS_CLIENT_ID,
} from "../utils/constants";
import { tokenCache } from "../utils/cache";
import {
  GoogleSignin,
  isErrorWithCode,
  SignInResponse,
  SignInSilentlyResponse,
  SignInSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { set } from "zod";

export type GoogleUser = {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
};

type AuthContextType = {
  user: GoogleUser | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  accessToken: string | null;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

WebBrowser.maybeCompleteAuthSession();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await GoogleSignin.getCurrentUser();
        if (userInfo) {
          setUser(userInfo.user);
        }
      } catch (e) {
        console.error("Error loading user:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: IOS_CLIENT_ID,
        profileImageSize: 150,
        offlineAccess: false,
        scopes: [
          "profile",
          "email",
          "openid",
          "https://www.googleapis.com/auth/drive.appdata",
        ],
      });

      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      let userInfo: GoogleUser;

      try {
        const silentResponse = await GoogleSignin.signInSilently();

        if (silentResponse.type === "noSavedCredentialFound") {
          const explitResponse =
            (await GoogleSignin.signIn()) as SignInResponse;

          userInfo = explitResponse.data?.user as GoogleUser;
        } else {
          userInfo = silentResponse.data.user as GoogleUser;
        }
      } catch (error) {
        throw new Error((error as Error).message, {
          cause: "Google sign in configuration",
        });
      }

      setUser(userInfo);

      const { accessToken } = await GoogleSignin.getTokens();

      if (accessToken) {
        setAccessToken(accessToken);
        await tokenCache?.saveToken(ACCESS_TOKEN_KEY, accessToken);
      }

      Toast.show({
        type: "success",
        text1: "Sign in Successful",
        text2: "Google sign-in completed!",
      });
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_REQUIRED:
            Toast.show({
              type: "error",
              text1: "Sign In Required",
              text2: "Please sign in to continue.",
            });
            break;
          case statusCodes.IN_PROGRESS:
            Toast.show({
              type: "error",
              text1: "Sign In Progress",
              text2: "Please wait for sign-in to complete.",
            });
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            Toast.show({
              type: "error",
              text1: "Play Services Error",
              text2: "Google Play Services not available or outdated.",
            });
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            Toast.show({
              type: "info",
              text1: "Cancelled",
              text2: "Sign-in was cancelled.",
            });
            break;
          default:
            Toast.show({
              type: "error",
              text1: "Sign In Error",
              text2: error.message || "An unknown error occurred.",
            });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: (error as Error).message || "Unexpected error occurred.",
        });
      }

      console.error("Sign-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await GoogleSignin.signOut();
    await GoogleSignin.revokeAccess();
    await tokenCache?.deleteToken("access_token");

    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut, accessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
