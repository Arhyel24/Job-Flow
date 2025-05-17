import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';

export type User = {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  walletAddress: string;
  about: string;
};

type AuthContextType = {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: Error }>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<{ error?: Error }>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          await fetchUserProfile(session.user.id);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserProfile(session.user.id);
        setIsLoggedIn(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoggedIn(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (data) setUser(data as User);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { error: undefined };
    } catch (error) {
      console.error("Login error:", error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async () => {
              try {
                const user = supabase.auth.getUser();
                const { data, error } = await user;
    
                if (error || !data?.user) {
                  Alert.alert('Error', 'Unable to retrieve user session.');
                  return;
                }
    
                const deleteRes = await supabase.auth.admin.deleteUser(data.user.id);
    
                if (deleteRes.error) {
                  Alert.alert('Error', deleteRes.error.message);
                  return;
                }
                await AsyncStorage.clear();
                await SecureStore.deleteItemAsync('userToken');
  
                supabase.auth.signOut();
    
                Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
              } catch (err) {
                Alert.alert('Error', 'An unexpected error occurred.');
                console.error('Delete error:', err);
              }
            }

  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const { data: { user }, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name,
            email,
            photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
            about: '' // Initialize empty
          });

        if (profileError) throw profileError;
      }

      return { error: undefined };
    } catch (error) {
      console.error("Registration error:", error);
      return { error: error as Error };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoggedIn, 
        isLoading, 
        login, 
        logout,
        deleteAccount,
        register 
      }}
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