import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStorage from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import getAccessToken from "../utils/token";

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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CLIENT_ID = process.env.GOOGLE_ANDROID_CLIENT_ID!;

const discovery = {
  authorizationEndpoint: "",
  tokenEndpoint: "",
  revocationEndpoint: ""
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: [
        "openid",
        "profile",
        "email",
        "https://www.googleapis.com/auth/drive.appdata"
      ],
      redirectUri: AuthSession.makeRedirectUri(),
    },
    discovery
  );

  // 🔧 FIXED: Immediate call of the async function
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = await getAccessToken()
        const userJson = await SecureStorage.getItemAsync("user");

        if (token && userJson) {
          setAccessToken(token);
          setUser(JSON.parse(userJson));
        }
      } catch (e) {
        console.error("Failed to load user:", e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const handleAuth = async () => {
        setLoading(true);
        try {
          const { code } = response.params;

          const tokenResult = await AuthSession.exchangeCodeAsync(
            {
              clientId: CLIENT_ID,
              code,
              redirectUri: AuthSession.makeRedirectUri(),
              extraParams: {
                code_verifier: request?.codeVerifier!,
              },
            },
            discovery
          );

          const token = tokenResult.accessToken;
          setAccessToken(token);
          await SecureStorage.setItemAsync("access_token", token);

          const userInfoRes = await fetch(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            {
              headers: {
                Authorization: `Bearer ${token}`,
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
      await promptAsync();
    } catch (e) {
      console.error("Sign-in error:", e);
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      setUser(null);
      setAccessToken(null);
      await SecureStorage.deleteItemAsync("access_token");
      await SecureStorage.deleteItemAsync("user");
    } catch (e) {
      console.error("Sign-out error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, accessToken }}>
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
