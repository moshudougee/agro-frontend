/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => void;
  registerUser: (email: string, password: string, role: string) => void;
  logout: () => void;
  clearError: () => void;
  setAuthState: (newState: Partial<AuthState>) => void;
}

const LOCAL_STORAGE_KEY = "authStore"

const loadState = (): AuthState => {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY)
  return savedState
    ? JSON.parse(savedState)
    : { 
      user: null, 
      isAuthenticated: false, 
      loading: false, 
      error: null,
      };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = loadState();
  return {
    ...initialState,

    logout: () => {
      set(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY)
        return { user: null, isAuthenticated: false, loading: false, error: null }
      });
    },

    clearError: () =>
      set((state) => {
        const newState = { ...state, error: null }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
        return newState
      }),

    setAuthState: (newState: Partial<AuthState>) => {
      set((state) => {
        const updatedState = { ...state, ...newState }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedState))
        return updatedState
      });
    },
  };
});


export const useAuthMutations = () => {
  const setAuthStore = useAuthStore((state) => state.setAuthState);

  // Login Mutation
  const sendLogin = async ({ email, password }: { email: string; password: string }) => {
    const res = await axios.post("/api/auth/login", { email, password });
    return res.data.rest;
  }
  const loginMutation = useMutation(
    {
      mutationFn: sendLogin,
      onSuccess: (user) => {
        const newState = { user, isAuthenticated: true, loading: false };
        setAuthStore(newState);
      },
      onError: (error: any) => {
        const newState = {
          error: error.response?.data.error || "Login failed. Please try again.",
          loading: false,
        }
        setAuthStore(newState);
      },
    }
  );

  // Register Mutation
  const sendRegister = async ({ email, password, role }: { email: string; password: string; role: string }) => {
    const res = await axios.post("/api/auth/register", { email, password, role });
    return res.data.user;
  }
  const registerMutation = useMutation(
    {
      mutationFn: sendRegister,
      onSuccess: (user) => {
        const newState = { user, isAuthenticated: true, loading: false };
        setAuthStore(newState);
      },
      onError: (error: any) => {
        const newState = {
          loading: false,
          error: error.response?.data.error || "Registration failed. Please try again.",
        }
        setAuthStore(newState);
      },
    }
  );

  return {
    login: (email: string, password: string) => loginMutation.mutate({ email, password }),
    registerUser: (email: string, password: string, role: string) =>
    registerMutation.mutate({ email, password, role }),
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};
