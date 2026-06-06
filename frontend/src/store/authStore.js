import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      userInfo: null,
      token: null,
      
      // Call this when the user successfully logs in via the backend
      login: (userData) => {
        set({ userInfo: userData, token: userData.token });
      },
      
      // Call this to log out
      logout: () => {
        set({ userInfo: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // The name of the item in localStorage
    }
  )
);