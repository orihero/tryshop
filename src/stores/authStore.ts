import { create } from 'zustand';
import type { Models } from 'appwrite';
import { account } from '@/lib/appwrite';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  checkSession: () => Promise<void>;
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  checkSession: async () => {
    try {
      const user = await account.get();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  setUser: (user) => set({ user }),

  logout: async () => {
    await account.deleteSession('current');
    set({ user: null });
  },
}));

// Hydrate auth state immediately on module load
useAuthStore.getState().checkSession();
