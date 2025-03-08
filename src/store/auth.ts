/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import axios from "axios";

interface AuthState {
  user: { id: string; email: string; role: string } | null;
  isAuthenticated: boolean;
  error: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, role: ROLE) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const LOCAL_STORAGE_KEY = "authStore";

// Load initial state from localStorage
const loadState = (): AuthState => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedState ? JSON.parse(savedState) : { user: null, isAuthenticated: false, loading: false, error: null };
};

export const useAuthStore = create<AuthState>((set) => {
  const initialState = loadState()

  return{
  ...initialState,

  login: async (email, password) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const user = res.data.rest;
      set((state) => {
          const newState = {...state, user, isAuthenticated: true, loading: false }
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
          return newState
      });
      
    } catch (err: any) {
      console.log(err);
      set((state) => {
        const newState = { ...state, error: err.response?.data.message || "Login failed. Please try again.", loading: false }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
        return newState;
      });
    }
  },

  registerUser: async (email, password, role) => {
    try {
      const res = await axios.post("/api/auth/register", { email, password, role });
      const user = res.data.user;
      set((state) => {
          const newState = { ...state, user, isAuthenticated: true, loading: false }
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
          return newState;
      });
      
    } catch (err: any) {
      console.log(err);
      set((state) => {
        const newState = { ...state, error: err.response?.data.message || "Registration failed. Please try again.", loading: false }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
        return newState;
      });
    }
  },

  logout: () => {
    //await axios.post("/api/auth/logout", {});
    set(() => {
      localStorage.removeItem(LOCAL_STORAGE_KEY)
      return { user: null, isAuthenticated: false, loading: false, error: null }
    });
  },

  clearError: () => set((state) => {
    const newState = { ...state, error: null }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState))
    return newState;
  }),
}});