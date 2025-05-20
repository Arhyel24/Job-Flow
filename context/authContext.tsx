import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import Toast from "react-native-toast-message";
import * as WebBrowser from "expo-web-browser";
import {
  AuthRequestConfig,
  DiscoveryDocument,
  exchangeCodeAsync,
  makeRedirectUri,
  Prompt,
  useAuthRequest,
} from "expo-auth-session";
import { Platform } from "react-native";
import { BASE_URL, GOOGLE_CLIENT_ID } from "../utils/constants";
import { tokenCache } from "../utils/cache";

export type GoogleUser = {
  sub: string;
  name: string;
  email: string;
  picture: string;
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

const redirectUri = makeRedirectUri();

const config: AuthRequestConfig = {
  clientId: "google",
  scopes: [
    "openid",
    "profile",
    "email",
    "https://www.googleapis.com/auth/drive.appdata",
  ],
  redirectUri: redirectUri,
  prompt: Prompt.SelectAccount,
};

const discovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const isWeb = Platform.OS === "web";

  const [request, response, promptAsync] = useAuthRequest(config, discovery);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await SecureStorage.getItemAsync("user");
        if (userInfo) {
          setUser(JSON.parse(userInfo));
        }
      } catch (e) {
        console.error("Error loading user:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const handleAuth = async () => {
        setLoading(true);
        try {
          const { code } = response.params;

          const tokenResult = await exchangeCodeAsync(
            {
              clientId: GOOGLE_CLIENT_ID,
              code,
              redirectUri: redirectUri,
              extraParams: {
                code_verifier: request?.codeVerifier!,
                platform: Platform.OS,
              },
            },
            discovery
          );

          setAccessToken(tokenResult.accessToken);
          setRefreshToken(tokenResult.refreshToken || null);
          await tokenCache?.saveToken("access_token", tokenResult.accessToken);
          await tokenCache?.saveToken(
            "refresh_token",
            tokenResult.refreshToken || ""
          );

          const userInfoRes = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${tokenResult.accessToken}`,
              },
            }
          );

          const userInfo: GoogleUser = await userInfoRes.json();
          setUser(userInfo);
          await SecureStorage.setItemAsync("user", JSON.stringify(userInfo));
        } catch (e) {
          console.error("Auth Error:", e);
        } finally {
          setLoading(false);
        }
      };

      handleAuth();
    }
  }, [response]);

  const signIn = async () => {
    setLoading(true);
    try {
      if (!request) {
        console.log("No request");
        return;
      }
      await promptAsync({
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
      });
    } catch (e) {
      if ((e as Error).message.includes("No matching browser activity")) {
        Toast.show({
          type: "error",
          text1: "Sign-in Error",
          text2:
            "No browser available to complete sign-in. Please install a browser app.",
        });
      }
      console.error("Sign-in error:", e);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!isWeb) {
      await tokenCache?.deleteToken("access_token");
      await tokenCache?.deleteToken("refresh_token");
    }

    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
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
